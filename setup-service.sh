
#!/bin/bash

# Felicity Hills Service Setup Script
# This script sets up the application as a systemd service

set -e

echo "Setting up Felicity Hills as a systemd service..."

# Create felicity user if it doesn't exist
if ! id "felicity" &>/dev/null; then
    echo "Creating felicity user..."
    sudo adduser --system --group --home /home/felicity --shell /bin/bash felicity
fi

# Create application directory and set permissions
echo "Setting up application directory..."
sudo mkdir -p /home/felicity/felicity-hills
sudo mkdir -p /home/felicity/felicity-hills/logs
sudo mkdir -p /home/felicity/felicity-hills/uploads

# Copy application files (you'll need to do this manually or via deployment)
echo "Make sure to copy your application files to /home/felicity/felicity-hills/"

# Set proper ownership
sudo chown -R felicity:felicity /home/felicity/felicity-hills

# Install tsx globally if not already installed
if ! command -v tsx &> /dev/null; then
    echo "Installing tsx globally..."
    sudo npm install -g tsx
fi

# Copy the systemd service file (already created above)
echo "Systemd service file should be at /etc/systemd/system/felicity-hills.service"

# Reload systemd
echo "Reloading systemd..."
sudo systemctl daemon-reload

# Enable the service to start at boot
echo "Enabling service to start at boot..."
sudo systemctl enable felicity-hills

echo "Service setup complete!"
echo ""
echo "To manage the service, use:"
echo "  sudo systemctl start felicity-hills    # Start the service"
echo "  sudo systemctl stop felicity-hills     # Stop the service"
echo "  sudo systemctl restart felicity-hills  # Restart the service"
echo "  sudo systemctl status felicity-hills   # Check service status"
echo "  sudo journalctl -u felicity-hills -f   # View logs"
echo ""
echo "Next steps:"
echo "1. Copy your application files to /home/felicity/felicity-hills/"
echo "2. Create /home/felicity/felicity-hills/.env with your environment variables"
echo "3. Install dependencies: cd /home/felicity/felicity-hills && npm install"
echo "4. Build the application: npm run build"
echo "5. Start the service: sudo systemctl start felicity-hills"
