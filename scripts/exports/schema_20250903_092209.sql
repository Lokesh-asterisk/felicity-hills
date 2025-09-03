--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (84ade85)
-- Dumped by pg_dump version 16.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.activities (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    type text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: admin_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_settings (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    key character varying NOT NULL,
    value text NOT NULL,
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: appointments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.appointments (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    lead_id character varying NOT NULL,
    title text NOT NULL,
    description text,
    appointment_date timestamp without time zone NOT NULL,
    duration integer DEFAULT 60,
    location text,
    property_id character varying,
    status text DEFAULT 'scheduled'::text NOT NULL,
    reminder_sent boolean DEFAULT false,
    created_by character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: brochure_downloads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.brochure_downloads (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    brochure_id character varying NOT NULL,
    user_name text NOT NULL,
    user_email text NOT NULL,
    user_phone text,
    downloaded_at timestamp without time zone DEFAULT now(),
    ip_address text,
    user_agent text
);


--
-- Name: brochures; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.brochures (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    download_url text NOT NULL,
    file_size text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: follow_ups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.follow_ups (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    lead_id character varying NOT NULL,
    title text NOT NULL,
    description text,
    due_date timestamp without time zone NOT NULL,
    priority text DEFAULT 'medium'::text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    assigned_to character varying,
    completed_at timestamp without time zone,
    created_by character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: leads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.leads (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text,
    phone text NOT NULL,
    company text,
    status text DEFAULT 'new'::text NOT NULL,
    source text NOT NULL,
    property_interests text[] DEFAULT '{}'::text[],
    budget text,
    notes text,
    assigned_to character varying,
    last_contact_date timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    interest_level text DEFAULT 'medium'::text
);


--
-- Name: plots; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.plots (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    plot_number text NOT NULL,
    size integer NOT NULL,
    price_per_sq_yd integer NOT NULL,
    road_width integer NOT NULL,
    category text NOT NULL,
    features text[] DEFAULT '{}'::text[],
    available boolean DEFAULT true,
    location text,
    size_in_sqft integer NOT NULL,
    price_per_sqft integer NOT NULL,
    soil_type text,
    water_access boolean DEFAULT false,
    road_access text,
    nearby_amenities text[]
);


--
-- Name: projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.projects (
    id character varying(255) DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    location text NOT NULL,
    description text NOT NULL,
    short_description text NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    type text NOT NULL,
    price_range text NOT NULL,
    features text[] DEFAULT ARRAY[]::text[],
    amenities text[] DEFAULT ARRAY[]::text[],
    images text[] DEFAULT ARRAY[]::text[],
    gallery_images text[] DEFAULT ARRAY[]::text[],
    video_url text,
    brochure_url text,
    master_plan_url text,
    location_map_url text,
    featured boolean DEFAULT false,
    sort_order integer DEFAULT 0,
    investment_returns text,
    total_area text,
    total_plots integer,
    available_plots integer,
    launch_date timestamp with time zone,
    possession_date timestamp with time zone,
    approvals text[] DEFAULT ARRAY[]::text[],
    connectivity text[] DEFAULT ARRAY[]::text[],
    nearby_attractions text[] DEFAULT ARRAY[]::text[],
    contact_person text,
    contact_phone text,
    contact_email text,
    seo_title text,
    seo_description text,
    seo_keywords text[] DEFAULT ARRAY[]::text[],
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    latitude text,
    longitude text
);


--
-- Name: session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


--
-- Name: site_visits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.site_visits (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    mobile text NOT NULL,
    email text,
    preferred_date text,
    plot_size text,
    budget text,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: testimonials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.testimonials (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    location text NOT NULL,
    investment integer NOT NULL,
    plot_size integer NOT NULL,
    returns integer NOT NULL,
    duration text NOT NULL,
    review text NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    email character varying,
    first_name character varying,
    last_name character varying,
    profile_image_url character varying,
    role text DEFAULT 'user'::text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: videos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.videos (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    video_url text NOT NULL,
    thumbnail_url text NOT NULL,
    duration text NOT NULL,
    category text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: activities activities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_pkey PRIMARY KEY (id);


--
-- Name: admin_settings admin_settings_key_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_settings
    ADD CONSTRAINT admin_settings_key_unique UNIQUE (key);


--
-- Name: admin_settings admin_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_settings
    ADD CONSTRAINT admin_settings_pkey PRIMARY KEY (id);


--
-- Name: appointments appointments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_pkey PRIMARY KEY (id);


--
-- Name: brochure_downloads brochure_downloads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brochure_downloads
    ADD CONSTRAINT brochure_downloads_pkey PRIMARY KEY (id);


--
-- Name: brochures brochures_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brochures
    ADD CONSTRAINT brochures_pkey PRIMARY KEY (id);


--
-- Name: follow_ups follow_ups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.follow_ups
    ADD CONSTRAINT follow_ups_pkey PRIMARY KEY (id);


--
-- Name: leads leads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_pkey PRIMARY KEY (id);


--
-- Name: plots plots_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.plots
    ADD CONSTRAINT plots_pkey PRIMARY KEY (id);


--
-- Name: plots plots_plot_number_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.plots
    ADD CONSTRAINT plots_plot_number_unique UNIQUE (plot_number);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: site_visits site_visits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_visits
    ADD CONSTRAINT site_visits_pkey PRIMARY KEY (id);


--
-- Name: testimonials testimonials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.testimonials
    ADD CONSTRAINT testimonials_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: videos videos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.videos
    ADD CONSTRAINT videos_pkey PRIMARY KEY (id);


--
-- Name: idx_session_expire; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_session_expire ON public.session USING btree (expire);


--
-- PostgreSQL database dump complete
--

