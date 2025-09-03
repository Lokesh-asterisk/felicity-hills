
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function generateSchemaInfo() {
  // Load environment variables
  require('dotenv').config();
  
  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔍 Analyzing database schema...');

    // Get all tables
    const tablesResult = await pool.query(`
      SELECT 
        table_name,
        table_type
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    // Get all columns with details
    const columnsResult = await pool.query(`
      SELECT 
        table_name,
        column_name,
        data_type,
        is_nullable,
        column_default,
        character_maximum_length,
        numeric_precision,
        numeric_scale
      FROM information_schema.columns 
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position;
    `);

    // Get primary keys
    const primaryKeysResult = await pool.query(`
      SELECT 
        tc.table_name,
        kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
      WHERE tc.constraint_type = 'PRIMARY KEY'
        AND tc.table_schema = 'public';
    `);

    // Get foreign keys
    const foreignKeysResult = await pool.query(`
      SELECT 
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public';
    `);

    // Get indexes
    const indexesResult = await pool.query(`
      SELECT 
        schemaname,
        tablename,
        indexname,
        indexdef
      FROM pg_indexes 
      WHERE schemaname = 'public'
      ORDER BY tablename, indexname;
    `);

    // Get table row counts
    const tableStats = {};
    for (const table of tablesResult.rows) {
      try {
        const countResult = await pool.query(`SELECT COUNT(*) FROM "${table.table_name}"`);
        tableStats[table.table_name] = parseInt(countResult.rows[0].count);
      } catch (error) {
        tableStats[table.table_name] = 'Error counting';
      }
    }

    // Generate schema information
    const schemaInfo = {
      generated_at: new Date().toISOString(),
      database_url_host: new URL(process.env.DATABASE_URL).host,
      tables: tablesResult.rows,
      table_statistics: tableStats,
      columns: columnsResult.rows,
      primary_keys: primaryKeysResult.rows,
      foreign_keys: foreignKeysResult.rows,
      indexes: indexesResult.rows
    };

    // Create exports directory
    const exportsDir = path.join(process.cwd(), 'exports');
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }

    // Write schema info to JSON file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const schemaInfoPath = path.join(exportsDir, `schema_info_${timestamp}.json`);
    fs.writeFileSync(schemaInfoPath, JSON.stringify(schemaInfo, null, 2));

    // Generate readable schema report
    let report = `# Felicity Hills Database Schema Report\n\n`;
    report += `Generated: ${schemaInfo.generated_at}\n`;
    report += `Database: ${schemaInfo.database_url_host}\n\n`;

    report += `## Table Summary\n\n`;
    report += `| Table Name | Type | Row Count |\n`;
    report += `|------------|------|----------|\n`;
    
    for (const table of tablesResult.rows) {
      const rowCount = tableStats[table.table_name];
      report += `| ${table.table_name} | ${table.table_type} | ${rowCount} |\n`;
    }

    report += `\n## Detailed Table Structures\n\n`;

    // Group columns by table
    const columnsByTable = {};
    columnsResult.rows.forEach(col => {
      if (!columnsByTable[col.table_name]) {
        columnsByTable[col.table_name] = [];
      }
      columnsByTable[col.table_name].push(col);
    });

    // Group primary keys by table
    const primaryKeysByTable = {};
    primaryKeysResult.rows.forEach(pk => {
      if (!primaryKeysByTable[pk.table_name]) {
        primaryKeysByTable[pk.table_name] = [];
      }
      primaryKeysByTable[pk.table_name].push(pk.column_name);
    });

    // Group foreign keys by table
    const foreignKeysByTable = {};
    foreignKeysResult.rows.forEach(fk => {
      if (!foreignKeysByTable[fk.table_name]) {
        foreignKeysByTable[fk.table_name] = [];
      }
      foreignKeysByTable[fk.table_name].push(fk);
    });

    // Generate detailed table info
    for (const table of tablesResult.rows) {
      const tableName = table.table_name;
      report += `### ${tableName}\n\n`;
      
      if (columnsByTable[tableName]) {
        report += `| Column | Type | Nullable | Default | Notes |\n`;
        report += `|--------|------|----------|---------|-------|\n`;
        
        columnsByTable[tableName].forEach(col => {
          const isPrimaryKey = primaryKeysByTable[tableName]?.includes(col.column_name);
          const foreignKey = foreignKeysByTable[tableName]?.find(fk => fk.column_name === col.column_name);
          
          let notes = [];
          if (isPrimaryKey) notes.push('PRIMARY KEY');
          if (foreignKey) notes.push(`FK → ${foreignKey.foreign_table_name}.${foreignKey.foreign_column_name}`);
          
          report += `| ${col.column_name} | ${col.data_type}`;
          if (col.character_maximum_length) report += `(${col.character_maximum_length})`;
          report += ` | ${col.is_nullable} | ${col.column_default || ''} | ${notes.join(', ')} |\n`;
        });
      }
      
      report += `\nRow count: ${tableStats[tableName]}\n\n`;
    }

    // Add indexes section
    if (indexesResult.rows.length > 0) {
      report += `## Indexes\n\n`;
      report += `| Table | Index Name | Definition |\n`;
      report += `|-------|------------|------------|\n`;
      
      indexesResult.rows.forEach(idx => {
        report += `| ${idx.tablename} | ${idx.indexname} | ${idx.indexdef} |\n`;
      });
      report += `\n`;
    }

    // Write readable report
    const reportPath = path.join(exportsDir, `schema_report_${timestamp}.md`);
    fs.writeFileSync(reportPath, report);

    console.log('✅ Schema analysis completed!');
    console.log(`📊 Schema info (JSON): ${schemaInfoPath}`);
    console.log(`📋 Schema report (Markdown): ${reportPath}`);
    console.log('\n📈 Database Statistics:');
    console.log(`Total tables: ${tablesResult.rows.length}`);
    
    let totalRows = 0;
    Object.values(tableStats).forEach(count => {
      if (typeof count === 'number') totalRows += count;
    });
    console.log(`Total rows: ${totalRows}`);

  } catch (error) {
    console.error('❌ Error analyzing schema:', error);
  } finally {
    await pool.end();
  }
}

generateSchemaInfo();
