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

--
-- Data for Name: activities; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.activities (id, title, description, type, created_at) FROM stdin;
941f703e-58b7-4291-9253-f07b0a5e8eaa	Demo	This is demo txt	inquiry	2025-08-17 13:13:55.721116
fbc169ac-d64f-4ffb-9434-20a6735d08a3	Site Visit Scheduled	Ramesh Patel from Ahmedabad booked a site visit for this weekend	visit	2025-08-20 11:16:50.444142
252e9e92-b8c6-4644-bd47-944b877e1c4d	Plot Inquiry	Meena Sharma called regarding 500 sq yard plots in Block A	inquiry	2025-08-20 11:16:50.444142
94b4858d-1302-473e-9982-ddf0e3273bcd	Plot Booking	Dr. Anil Kumar from Ghaziabad confirmed booking for Plot A-125	sale	2025-08-20 11:16:50.444142
a8879d92-7a52-4450-8c44-924858c62c91	Client Meeting	Investment discussion with retired banker from Chandigarh	meeting	2025-08-20 11:16:50.444142
c3914c7f-7b80-4911-b4d0-49235a6ea1eb	Documentation Query	Sunil Agarwal requested legal clearance documents via email	inquiry	2025-08-20 11:16:50.444142
62ba8172-3204-432a-81b8-c38b9599d6e5	Family Site Visit	Gupta family from Delhi visited with 3 members, very interested	visit	2025-08-20 11:16:50.444142
6e4491c0-ae28-4902-b901-5f3b205795ef	Payment Received	Token amount received for Plot B-078 from Mumbai investor	sale	2025-08-20 11:16:50.444142
e843f31f-3860-4970-a0b6-dc72d6973631	Price Inquiry	WhatsApp inquiry about current rates and payment plans	inquiry	2025-08-20 11:16:50.444142
8d75d9ef-817f-42ec-ac55-13f01d5fc88a	Weekend Visit	Group of 5 investors from Noida scheduled for Saturday tour	visit	2025-08-20 11:16:50.444142
a0b64870-a7b2-4fde-9bbd-ba7c7c0bf3b7	Soil Report Request	Prospective buyer asked for detailed soil analysis report	inquiry	2025-08-20 11:16:50.444142
57cca805-d7d6-4ba9-bb27-d61c3bb07582	Registration Complete	Plot C-156 registration completed for Bangalore client	sale	2025-08-20 11:16:50.444142
15010f41-5ce5-40ab-9cae-66237b18bf56	Investment Consultation	Financial advisor brought 3 clients for project overview	meeting	2025-08-20 11:16:50.444142
97742a1e-c13b-4fc3-9a41-fd20456ad487	Return Query	Investor asking about expected appreciation over 5 years	inquiry	2025-08-20 11:16:50.444142
d05f5bcf-f2d0-489a-83ca-7a93f2c010d9	Repeat Visit	Previous customer bringing relatives for second site inspection	visit	2025-08-20 11:16:50.444142
e9a74ad1-2249-400e-b0de-6eecc7770e46	Financing Options	Bank manager inquiry about loan eligibility for agricultural land	inquiry	2025-08-20 10:32:00.606409
0287514d-40b1-48ee-8e70-07546f1df7ce	Morning Site Tour	Early morning visit by retired army officer from Dehradun	visit	2025-08-20 09:17:00.606409
054a8115-55ec-434b-8b99-676686e4f11a	Documentation Started	Registry process initiated for Plot D-234 for Pune family	sale	2025-08-20 08:17:00.606409
51ce3b72-6320-45ab-bd8a-4e9bf1036b67	Partnership Discussion	Meeting with local farming consultant about crop advisory	meeting	2025-08-20 07:17:00.606409
4275ec16-60a4-4767-bbd8-dec8180eb4bc	Investment Comparison	Detailed comparison request with other agricultural projects	inquiry	2025-08-20 05:17:00.606409
b1579477-9850-4a32-a4a4-48b3342b99e9	Corporate Group Visit	IT company employees group visit for collective investment	visit	2025-08-20 03:17:00.606409
0c68cf20-1395-45c6-a767-184d1618ca8f	Plot Inquiry	Varun jolly called regarding 500 sq yard plots in Block A	inquiry	2025-08-22 01:59:02.207149
0f943372-6b4a-4c80-9fb5-2b2a423de970	Registry Done	Registry done for Lokesh Sharma	other	2025-08-29 22:39:45.23066
\.


--
-- Data for Name: admin_settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.admin_settings (id, key, value, updated_at) FROM stdin;
\.


--
-- Data for Name: appointments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.appointments (id, lead_id, title, description, appointment_date, duration, location, property_id, status, reminder_sent, created_by, created_at, updated_at) FROM stdin;
1adc2fb7-a8a0-49ba-a6fe-b3aa210a0e7a	e6b8c930-013d-42b1-996e-4384c5fec646	Property Viewing - Downtown Office	Show downtown office space options	2025-08-24 16:00:00	90	123 Main St, Downtown	\N	scheduled	f	\N	2025-08-24 13:45:28.289536	2025-08-24 13:45:28.289536
7b63bc51-881d-48ce-9f23-77c87098b832	0bee0248-8c4a-4549-a9dc-6578db088975	Investment Consultation	Discuss investment property options	2025-08-24 14:30:00	60	Our Office	\N	confirmed	f	\N	2025-08-24 13:45:38.85547	2025-08-24 13:45:38.85547
a69f07e8-32c0-4b86-a2cb-6fc58d0a6d4e	7ec73978-cbee-4be6-804c-e531ef63f74c	site visit required	need to visit the site	2025-08-26 06:39:00	60	khushalipur	\N	in_progress	f	\N	2025-08-24 19:46:55.830789	2025-08-24 19:46:55.830789
\.


--
-- Data for Name: brochure_downloads; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.brochure_downloads (id, brochure_id, user_name, user_email, user_phone, downloaded_at, ip_address, user_agent) FROM stdin;
ffc5d3aa-fc66-4e31-8b5c-2d76c048336a	9cf5edeb-bdf1-41fa-afaa-662bd03d8ed8	lokesh	lokesh.mvt@gmail.com	\N	2025-08-29 22:41:44.717098	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0
b3d7ef7e-091d-44a9-afb5-7b165671b2fb	b4ae7457-e8a2-4db8-8c1d-b0aa689d54a0	test	lokesh.mvt@gmail.com	\N	2025-08-31 05:35:03.900251	172.31.121.34	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0
\.


--
-- Data for Name: brochures; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.brochures (id, title, description, download_url, file_size, created_at) FROM stdin;
0e9caaf9-5dd6-42c4-8e55-89e1170bd616	Price List & Payment Plans	Detailed pricing for all plot categories with flexible payment options.	#	1.8 MB	2025-08-06 10:50:49.217611
8e53b3f8-860e-4df3-a39a-7f4a56ead277	Legal Documentation	Registry, clearance certificates, and legal compliance documents.	#	3.2 MB	2025-08-06 10:50:49.740449
5acea761-71c2-48a6-ad01-f6498004887d	Master Plan Layout	Detailed site plan showing plot numbers, roads, and amenities.	#	4.1 MB	2025-08-06 10:50:49.75554
9cf5edeb-bdf1-41fa-afaa-662bd03d8ed8	Amenities Guide	Complete guide to all amenities and recreational facilities.	#	2.9 MB	2025-08-06 10:50:49.771766
48954a95-117d-4d13-aad0-3fcbddc64e72	Khushalipur - Premium Agricultural Land Investment	Comprehensive investment guide featuring detailed plot information, ROI calculations, legal documentation, and strategic location advantages. Perfect for investors seeking high-return agricultural land opportunities near Delhi-Dehradun Expressway.	/brochures/khushalipur-premium-agricultural-land-investment.html	24.9 KB	2025-08-06 11:11:07.283797
b4ae7457-e8a2-4db8-8c1d-b0aa689d54a0	Khushalipur Project Brochure	Complete project overview with pricing, amenities, and location advantages.	/khushalipur-project-brochure.pdf	33 MB	2025-08-06 10:50:49.195004
\.


--
-- Data for Name: follow_ups; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.follow_ups (id, lead_id, title, description, due_date, priority, status, assigned_to, completed_at, created_by, created_at, updated_at) FROM stdin;
c1bc1e49-0123-4986-8330-126a330aa216	b356d3d6-56b8-4eb5-8927-511a2941a0b4	follow up in property interest	he is interested. tried to coneince for giving booking price and book the plot 	2025-08-28 00:00:00	urgent	completed	admin	\N	\N	2025-08-24 14:47:44.249234	2025-08-24 14:49:29.932
1f7cd530-f8f3-4fd5-bf7c-cf66f29c0b27	0c7a3859-0cd8-4ed4-a926-2399689e965b	bbrita gym trainer		2025-08-31 00:00:00	high	pending	\N	\N	\N	2025-08-31 05:42:19.508355	2025-08-31 05:42:19.508355
\.


--
-- Data for Name: leads; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.leads (id, first_name, last_name, email, phone, company, status, source, property_interests, budget, notes, assigned_to, last_contact_date, created_at, updated_at, interest_level) FROM stdin;
d077c4a2-8f9b-489a-b2fa-f6752a12ffb1	Rahul Gym	Trainer		9250665563	bbritta gym	new	walk_in	{}	na	meets him at gym and need to be folowup	\N	\N	2025-08-24 14:40:31.125085	2025-08-24 14:40:31.125085	medium
55217a63-6e4e-47f5-acc8-337911fc2b59	Sector 17	Prospect		1234567890		new	walk_in	{}		folowup	\N	\N	2025-08-24 14:45:11.39927	2025-08-24 14:45:11.39927	medium
51c01ffc-f396-4d17-8c43-e62d717ce716	scahin	father		1234567890		new	walk_in	{}			\N	\N	2025-08-24 14:45:29.562476	2025-08-24 14:45:29.562476	medium
0c7a3859-0cd8-4ed4-a926-2399689e965b	gym	receptionist		1234567890		qualified	walk_in	{}			\N	\N	2025-08-24 14:45:53.734914	2025-08-25 08:47:17.96	very_high
823e3c6d-0e22-4dea-9547-cdce9d089b1c	Aditya	Jangra		+918742905070 ::: +91 81783 99533		new	import	{}			\N	\N	2025-08-24 19:41:36.636629	2025-08-24 19:41:36.636629	medium
2a56e7eb-0f24-40c4-86d8-f6440383c1a1	Sandeep	Loni		099 53 878152		new	import	{}			\N	\N	2025-08-24 19:41:36.665095	2025-08-24 19:41:36.665095	medium
a4afe2f5-f107-4180-8945-973730308347	Jyoti	Bhabhi		919310022415		new	import	{}			\N	\N	2025-08-24 19:41:36.681142	2025-08-24 19:41:36.681142	medium
aec0214e-3772-4a16-9869-c3ecd0293448	Rajesh	Ghari		9891461888		new	import	{}			\N	\N	2025-08-24 19:41:36.698446	2025-08-24 19:41:36.698446	medium
7c0eaebd-f1ff-46f8-ae0b-0a1554556273	Gzb	doctor		099-990-12355		new	import	{}			\N	\N	2025-08-24 19:41:36.715974	2025-08-24 19:41:36.715974	medium
f92793e9-4e3a-4165-9dfa-bd1026014a17	SANJAY	ji Maujpur		991-106-7946		new	import	{}			\N	\N	2025-08-24 19:41:36.734877	2025-08-24 19:41:36.734877	medium
a2557b6a-5abf-4805-9846-1e313a6c4f4f	REENA	ANTI		085-878-93883		new	import	{}			\N	\N	2025-08-24 19:41:36.751914	2025-08-24 19:41:36.751914	medium
bef7cfc4-c297-41e7-81cb-3fb30fedaf18	Papa	Meerut		+91 92196 68555 ::: 76681 45794		new	import	{}			\N	\N	2025-08-24 19:41:36.768849	2025-08-24 19:41:36.768849	medium
2d50ca86-1607-4107-b973-4bf2f26aa2b7	Rajinder	Singh Industry Equipments		+91 98997 26655		new	import	{}			\N	\N	2025-08-24 19:41:36.786274	2025-08-24 19:41:36.786274	medium
ed229c65-6642-4d9f-9564-b8c17af9cc90	Sandeep	Ji		919417080400		new	import	{}			\N	\N	2025-08-24 19:41:36.803205	2025-08-24 19:41:36.803205	medium
eca0e29e-5c3d-4de4-9a1d-dd233dfdfecd	Vipin	Gupta		+91 99104 18999		new	import	{}			\N	\N	2025-08-24 19:41:36.820168	2025-08-24 19:41:36.820168	medium
5e3552d8-9fcf-4a98-b25f-8fcecd11eb01	Parbha	didi		012-043-77464		new	import	{}			\N	\N	2025-08-24 19:41:36.837504	2025-08-24 19:41:36.837504	medium
4d625131-b6a1-4415-b5e0-300a0ef6a2c5	Sachin	Iyogi Yadav		918800530505		new	import	{}			\N	\N	2025-08-24 19:41:36.854858	2025-08-24 19:41:36.854858	medium
ee8e2c70-4e5f-4e1e-9573-d1986741a517	Ankur	Goel		+91 97117 33754		new	import	{}			\N	\N	2025-08-24 19:41:36.872004	2025-08-24 19:41:36.872004	medium
faadd7e3-8a5f-4bb7-8878-f262f10f1a47	Lambu	Kuldeep jija ji		+91 98719 59386		new	import	{}			\N	\N	2025-08-24 19:41:36.888766	2025-08-24 19:41:36.888766	medium
b0571ead-b3ee-4d6e-b33d-e3a39a79e8ff	Bharat	Singh		+91 98117 78532		new	import	{}			\N	\N	2025-08-24 19:41:36.905807	2025-08-24 19:41:36.905807	medium
781c66c1-2ec2-4d7c-984e-0ed12b96fecd	Nitesh	PalSingh	nitesh.login@gmail.com	919582911950		new	import	{}			\N	\N	2025-08-24 19:41:36.922796	2025-08-24 19:41:36.922796	medium
90247217-d5cb-4509-bbcf-9004f15ebff6	Reena	Loni		095-556-05477		new	import	{}			\N	\N	2025-08-24 19:41:36.940049	2025-08-24 19:41:36.940049	medium
42a32083-3531-47a9-ab41-5f1dc0e193b7	Rajat	Jain	rajat.login@gmail.com	9560003565		new	import	{}			\N	\N	2025-08-24 19:41:36.958662	2025-08-24 19:41:36.958662	medium
afcb0d2d-0d95-4cb2-a086-75be2e34c5d3	Praveen	Krissh	parvind.sharma@gmail.com	919871138873		new	import	{}			\N	\N	2025-08-24 19:41:36.976122	2025-08-24 19:41:36.976122	medium
ed886ecd-6826-42a3-8b77-d5bcaf6e33a2	BADI	Mausi Ji		098-689-50482		new	import	{}			\N	\N	2025-08-24 19:41:36.99352	2025-08-24 19:41:36.99352	medium
95134611-10f3-4595-a2c2-9e5ac9a59c5c	SURENDER	BHAIYA		099-111-73370		new	import	{}			\N	\N	2025-08-24 19:41:37.010987	2025-08-24 19:41:37.010987	medium
5c182d9c-f2c9-448e-9a9b-977cc84109cc	Rajesh	Ji		919899693208		new	import	{}			\N	\N	2025-08-24 19:41:37.02808	2025-08-24 19:41:37.02808	medium
d6c57450-61c3-4079-985f-0a84f47a67e7	Guddy	Ji		919464366155		new	import	{}			\N	\N	2025-08-24 19:41:37.045237	2025-08-24 19:41:37.045237	medium
b71ffa3c-69e6-4789-af7b-06d115504d24	Pinto	Bhaisaab		098370 45515		new	import	{}			\N	\N	2025-08-24 19:41:37.06449	2025-08-24 19:41:37.06449	medium
9747a7c5-f2e5-4696-b8a8-c085285bb55e	Kuldeep	Jija Ji		092-120-23016		new	import	{}			\N	\N	2025-08-24 19:41:37.082189	2025-08-24 19:41:37.082189	medium
4eedb3b7-06d7-42b2-8a6f-9f5c287a74b3	Rakesh	Np		07827776797 ::: +91 96436 52621		new	import	{}			\N	\N	2025-08-24 19:41:37.099371	2025-08-24 19:41:37.099371	medium
5c286a32-535e-4e93-8f54-4e795f215f4d	Vishal	Iyogi Maheswari		9818239996		new	import	{}			\N	\N	2025-08-24 19:41:37.124143	2025-08-24 19:41:37.124143	medium
c0e09ea5-7c57-47cf-aae3-4c25b7a58092	Ankit Gupta	Iyogi		+91 80103 82718		new	import	{}			\N	\N	2025-08-24 19:41:37.142017	2025-08-24 19:41:37.142017	medium
179172a9-8026-4849-8fd9-63d197abcc19	Rishi Karol Bagh	Us4		+91 98118 84277		new	import	{}			\N	\N	2025-08-24 19:41:37.159074	2025-08-24 19:41:37.159074	medium
817e4701-d861-47e7-a5c1-5bdf563592e5	Pankaj	Car Wale		+91 89205 09907		new	import	{}			\N	\N	2025-08-24 19:41:37.176056	2025-08-24 19:41:37.176056	medium
0a1b7a03-0d56-40f0-8fd6-185d94e581e6	Mirchi	Walk		+91 11 4346 6600		new	import	{}			\N	\N	2025-08-24 19:41:37.193405	2025-08-24 19:41:37.193405	medium
24b8bbf5-5660-4887-b49f-5111ec89707c	Harish	Patel Mswipe	harish@logicloop.io	+91 99870 27067		new	import	{}			\N	\N	2025-08-24 19:41:37.210587	2025-08-24 19:41:37.210587	medium
3a770c0d-c88c-451a-a96e-82f09915f3aa	Ford Insurance	Wale		+91 72900 96133		new	import	{}			\N	\N	2025-08-24 19:41:37.227592	2025-08-24 19:41:37.227592	medium
b356d3d6-56b8-4eb5-8927-511a2941a0b4	Ovi's	Father		1234567890		qualified	walk_in	{}		interesting in buying but buy it in 2026 may be in jan or feb	\N	\N	2025-08-24 14:44:23.067715	2025-08-25 08:47:32.262	very_high
86b0bebb-40b3-4cb7-9965-8ca9a74d2882	Rahul Chauhan	Us4		99538 00680		new	import	{}			\N	\N	2025-08-24 19:41:37.24504	2025-08-24 19:41:37.24504	medium
251348b2-eab5-4d9e-906e-58a2d16f72fc	Uddham Singh	Dr. Ish Anand neuro Surgeon 		99719 34260		new	import	{}			\N	\N	2025-08-24 19:41:37.265313	2025-08-24 19:41:37.265313	medium
29044e8d-e806-4633-8cff-4f4d4ecac5d9	Somya	Iyogi		8860764014		new	import	{}			\N	\N	2025-08-24 19:41:37.28211	2025-08-24 19:41:37.28211	medium
6a0244c8-efb2-4afd-9803-1b059f031993	Deepak Tel Wala	Najafgarh		919312230363		new	import	{}			\N	\N	2025-08-24 19:41:37.302684	2025-08-24 19:41:37.302684	medium
2713ecae-9e4a-4835-94bd-88e77fea01e0	Ashutosh Bhatnagar	ICICI		919810929378		new	import	{}			\N	\N	2025-08-24 19:41:37.320782	2025-08-24 19:41:37.320782	medium
48800249-9daf-4380-a4a8-41612f65ad50	Abhishek	Car Wale		919310138495		new	import	{}			\N	\N	2025-08-24 19:41:37.337142	2025-08-24 19:41:37.337142	medium
884c92de-1279-4f27-aee9-31b58d63fdcd	Vikram	Spectranet		99996 30980		new	import	{}			\N	\N	2025-08-24 19:41:37.355138	2025-08-24 19:41:37.355138	medium
fb38b3fe-9c09-4dd4-8872-f414f9bf22cb	Ajendra Mishra	us4		+91 96679 84607		new	import	{}			\N	\N	2025-08-24 19:41:37.372673	2025-08-24 19:41:37.372673	medium
14a4b9e2-df72-45ae-bb34-083c531db70e	Chotu	Manish		9910960355		new	import	{}			\N	\N	2025-08-24 19:41:37.39	2025-08-24 19:41:37.39	medium
27ec49e7-b313-4506-9ddf-122be0a35071	Suresh	Techclub		+91 80106 14774		new	import	{}			\N	\N	2025-08-24 19:41:37.407074	2025-08-24 19:41:37.407074	medium
243081a5-c040-41a8-ab8a-025ca24c3f94	Rakesh Electrician	L & T		98185 94070		new	import	{}			\N	\N	2025-08-24 19:41:37.423104	2025-08-24 19:41:37.423104	medium
991a47b3-ff0d-4d54-b13b-135f40288963	Gcc	Sreeraj		+971 52 428 8976		new	import	{}			\N	\N	2025-08-24 19:41:37.441323	2025-08-24 19:41:37.441323	medium
98bc0745-e584-42ad-9ccc-481a1f8b8413	Basant	Icon Global		098108 87227 ::: +91 81788 11330		new	import	{}			\N	\N	2025-08-24 19:41:37.458405	2025-08-24 19:41:37.458405	medium
f1e0a5f2-c2a9-4190-acb7-395793fe47b6	Avinash Shukla	Us4		918826368972		new	import	{}			\N	\N	2025-08-24 19:41:37.475705	2025-08-24 19:41:37.475705	medium
22dfa969-b2cb-4260-8830-47007a5aa504	Tara Pandey 	Brother		63979 29283		new	import	{}			\N	\N	2025-08-24 19:41:37.493033	2025-08-24 19:41:37.493033	medium
1196c929-3690-4b40-a11b-6a0e9574ff4e	Sumit	Techclub		+91 821 810 9523		new	import	{}			\N	\N	2025-08-24 19:41:37.510591	2025-08-24 19:41:37.510591	medium
807e4fec-17df-4341-8ca6-98e8b9bed9f5	Idfc Relationahip	Manager 		+91 22 6777 1614		new	import	{}			\N	\N	2025-08-24 19:41:37.527912	2025-08-24 19:41:37.527912	medium
ba12cb8e-3d9e-436d-bfcd-3b2c7182b0b9	Ankush Garg	IT Solutions- McAfee		99716 96302		new	import	{}			\N	\N	2025-08-24 19:41:37.547123	2025-08-24 19:41:37.547123	medium
2b50bdcd-a79e-4d5f-9eaf-4948abc4f9fd	Manish Tehri 	Income Tex Office 		+91 80575 28921		new	import	{}			\N	\N	2025-08-24 19:41:37.564625	2025-08-24 19:41:37.564625	medium
cbd465f7-d3c8-4809-81eb-b757a5dd0f72	Sonu Nainital	 PropertyWala		+91 80810 11983		new	import	{}			\N	\N	2025-08-24 19:41:37.582128	2025-08-24 19:41:37.582128	medium
af393dce-b5fb-4044-a856-8a61bc6313a5	Lalit	unknown		88608 08652		new	import	{}			\N	\N	2025-08-24 19:41:37.599268	2025-08-24 19:41:37.599268	medium
fb2e7e17-7246-45e1-a6b7-cce9218ad06d	Durgesh	ji		+91 79886 17675		new	import	{}			\N	\N	2025-08-24 19:41:37.616335	2025-08-24 19:41:37.616335	medium
3f80e1a5-4507-40bb-a07b-e9fdb9a4b5be	Jaibeer	Us4		85274 20424		new	import	{}			\N	\N	2025-08-24 19:41:37.6334	2025-08-24 19:41:37.6334	medium
ea828c63-6fba-4c71-a0a5-274af875eb74	Dharmendra kumar Advocate	557 L&T		919811976690		new	import	{}			\N	\N	2025-08-24 19:41:37.667632	2025-08-24 19:41:37.667632	medium
e8e92672-d9e1-4d07-bb19-f690db1f8229	Surojeet	Maiti-US4		+91 78276 34633		new	import	{}			\N	\N	2025-08-24 19:41:37.685057	2025-08-24 19:41:37.685057	medium
75b034ba-6be0-4f37-bdae-f7f10337bc7d	Kishen Mehta	Craft		89549 99247		new	import	{}			\N	\N	2025-08-24 19:41:37.719711	2025-08-24 19:41:37.719711	medium
d8aedd1f-aa98-4adc-902c-cad7b15c680e	RP Homes	Property Dealer		+91 98219 22131		new	import	{}			\N	\N	2025-08-24 19:41:37.737005	2025-08-24 19:41:37.737005	medium
2df5ac82-2af1-4307-8286-7353070e2e43	Kaushal	Saraf		+91 92055 28943 ::: +91 95995 81187 ::: +91 96250 06648		new	walk_in	{}			\N	\N	2025-08-24 19:41:37.754242	2025-08-24 19:45:01.701	high
7ec73978-cbee-4be6-804c-e531ef63f74c	Manu	Chaudhary		+91 98990 16056		contacted	cold_call	{}	25000		\N	\N	2025-08-24 19:41:37.702464	2025-08-24 19:55:09.608	high
4dac349e-04e2-4646-a3c0-41abaf50ac44	Vikas	Sharma		919891667621		new	import	{}	500000		\N	\N	2025-08-24 19:41:37.650629	2025-08-25 10:50:50.769	very_high
\.


--
-- Data for Name: plots; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.plots (id, plot_number, size, price_per_sq_yd, road_width, category, features, available, location, size_in_sqft, price_per_sqft, soil_type, water_access, road_access, nearby_amenities) FROM stdin;
57f1d931-5778-4cbb-b4d0-dfc39d391ceb	A-001	500	3000	20	premium	{"Water Connection",Electricity,"Road Access","Fertile Soil"}	t	gate_facing	4500	333	\N	f	\N	\N
239da8f9-4615-472b-9302-e1d2573313f4	B-002	750	3000	30	premium	{"Water Connection",Electricity,"Road Access","Organic Certified"}	t	corner	6750	333	\N	f	\N	\N
55522997-ef56-43ff-ac82-e358d57daae7	C-003	1000	3000	40	cottage	{"Water Connection",Electricity,"Corner Plot","Prime Location"}	f	pool_facing	9000	333	\N	f	\N	\N
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.projects (id, name, location, description, short_description, status, type, price_range, features, amenities, images, gallery_images, video_url, brochure_url, master_plan_url, location_map_url, featured, sort_order, investment_returns, total_area, total_plots, available_plots, launch_date, possession_date, approvals, connectivity, nearby_attractions, contact_person, contact_phone, contact_email, seo_title, seo_description, seo_keywords, is_active, created_at, updated_at, latitude, longitude) FROM stdin;
a5652df8-8ee7-4154-8911-0bbd54a4a942	Riverside Gardens	Haridwar Road, Dehradun	Eco-friendly residential development near the holy Ganges with sustainable living features. Experience tranquil living with spiritual significance and natural beauty.	Eco-friendly plots near Ganges river	active	Eco-friendly Plots	₹12,000/sq yd onwards	{"River proximity","Eco-friendly design","Sustainable living","Religious significance",Pollution-free}	{"Solar Power","Rainwater Harvesting","Waste Management","Organic Gardens","Community Hall"}	{https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800}	{}	\N	\N	\N	\N	f	4	10-12% annually	40 acres	120	\N	\N	\N	{"Environmental Clearance","Revenue Approved","Panchayat NOC"}	{"Haridwar Road 1km","Ganges River 2km","Rishikesh 45km"}	{}	\N	\N	\N	\N	\N	{}	t	2025-08-25 07:31:24.949869+00	2025-08-25 07:31:24.949869+00	\N	\N
22ed7b25-b674-4099-9f63-685461418e81	Khushalipur Premium Plots	Near Delhi-Dehradun Expressway, Dehradun	Premium agricultural land investment opportunity with excellent connectivity and guaranteed returns. Located strategically near the Delhi-Dehradun Expressway with all modern amenities and complete legal approvals.	Premium agricultural plots with guaranteed returns	active	residential	₹8,100/sq yd onwards	{"Water facility","Main road access","15-20% returns","Complete approvals","Fertile soil","Investment grade"}	{"24/7 Security","Water Supply","Electricity Connection","Paved Roads","Boundary Wall"}	{https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800,https://images.unsplash.com/photo-1592595896551-12b371d546d5?w=800}	{}	\N	\N	\N	\N	t	2	15-20% annually	50 acres	200	\N	\N	\N	{"Revenue Approved","RERA Approved","NOC Approved"}	{"Delhi-Dehradun Expressway 2km","Dehradun City 15km","Airport 20km"}	{}	\N	\N	\N	\N	\N	{}	t	2025-08-25 07:31:24.949869+00	2025-08-28 18:46:31.947+00	30.14025026420802	77.84634540109978
e390d13c-56c0-4d8e-9917-35fa0c1010e0	Green Valley Commercial Hub	ISBT Area, Dehradun	Strategic commercial development opportunity in the heart of Dehradun with high footfall and excellent business potential. Ideal for retail, office spaces, and commercial ventures.	Commercial plots in prime business district	coming_soon	Commercial Plots	₹25,000/sq yd onwards	{"Prime location","High footfall","Business district","Metro connectivity planned","High ROI potential"}	{"Wide Roads","Parking Space","Power Backup","Fire Safety","24/7 Security"}	{https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800}	{}	\N	\N	\N	\N	t	3	18-25% annually	25 acres	80	\N	\N	\N	{"Commercial License","Building Plan Approved","Fire NOC"}	{"ISBT 500m","Railway Station 3km","Airport 22km"}	{}	\N	\N	\N	\N	\N	{}	t	2025-08-25 07:31:24.949869+00	2025-08-28 18:45:18.285+00	\N	\N
49b87b06-490b-44c0-916c-9f81440e80fe	Felicity Hills Residences	Mussoorie Road, Dehradun	Luxury residential plots with panoramic mountain views and premium infrastructure. Perfect for building your dream home in the lap of nature with modern conveniences.	Luxury residential plots with mountain views	active	residential	₹15,000/sq yd onwards	{"Mountain views","Premium location","Gated community","Modern infrastructure","Cool climate"}	{"Gated Security",Clubhouse,"Landscaped Gardens","Kids Play Area","Jogging Track"}	{https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800,https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800}	{}	\N	\N	\N	\N	f	3	12-15% annually	75 acres	150	\N	\N	\N	{"Municipal Approved","Forest Clearance","Building Permission"}	{"Mussoorie Road direct access","Dehradun Airport 25km","Railway Station 18km"}	{}	\N	\N	\N	\N	\N	{}	t	2025-08-25 07:31:24.949869+00	2025-08-31 05:39:49.647+00	30.455272063134693	77.93139720012722
d645f151-b691-45f8-8b22-d1dfe3671a57	Panchur Hills Premium Plots	Pauri Garhwal, Uttarakhand	Panchur is a serene and beautiful village nestled in the Pauri district of Uttarakhand. Surrounded by nature, it offers a tranquil lifestyle, perfect for those seeking peace, clean air, and scenic beauty. From Panchur, you can catch a distant view of the Himalayan peaks, and the valley view of the Alaknanda River is simply breathtaking.	Your Peaceful Home in the Hills - Scenic plots with Himalayan views in the heart of Pauri Garhwal	active	mixed	₹3,900 - ₹4,900 per sq ft	{"Scenic plots with Himalayan views",Road,water,"and electricity infrastructure","Ideal for building cottages",farmhouses,"or retreats","Eco-conscious development plan","Perfect for retirees or those seeking a quiet life in the hills",1,"115 meters elevation","Cooler climate than plains"}	{"Himalayan peak views","Alaknanda River valley views","Clean mountain air","Peaceful environment","Natural surroundings","All-weather road access","Electricity connection","Water supply"}	{@assets/panchur-media/panchur-image-2.jpg,@assets/panchur-media/panchur-image-3.jpg,@assets/panchur-media/panchur-image-4.jpg,@assets/panchur-media/panchur-image-5.jpg,@assets/panchur-media/panchur-image-6.jpg,@assets/panchur-media/panchur-image-7.jpg}	{@assets/panchur-media/panchur-image-2.jpg,@assets/panchur-media/panchur-image-3.jpg,@assets/panchur-media/panchur-image-4.jpg,@assets/panchur-media/panchur-image-5.jpg,@assets/panchur-media/panchur-image-6.jpg,@assets/panchur-media/panchur-image-7.jpg}	@assets/panchur-media/panchur-video-8.mp4	\N	@assets/panchur-media/panchur-map.pdf	https://maps.app.goo.gl/mgb1ypEN82pq46MZ6?g_st=awb	t	1	High appreciation potential	Multiple plot sizes available	\N	\N	\N	\N	{}	{"Delhi: 354 km","Rishikesh: 114 km","Ganga Sangam (Devprayag): 49 km","Kirtinagar: 16 km","Srinagar: 20 km","Janasu Railway Station: 10 km (under construction)"}	{"Himalayan peaks view","Alaknanda River","Devprayag (Ganga Sangam)","Rishikesh - Yoga Capital","Upcoming Janasu Railway Station","India's Longest Railway Tunnel (under construction)"}	The Climbing Creeper	+91 85888 34221	info@felicityhills.com	Panchur Pauri Garhwal - Himalayan View Plots | Felicity Hills	Discover peaceful hill station plots in Panchur, Pauri Garhwal with stunning Himalayan views. Perfect for cottages, farmhouses & retirement homes. Starting ₹3,900/sq ft.	{"Panchur plots","Pauri Garhwal real estate","Himalayan view plots","Uttarakhand property","hill station plots","retirement homes Uttarakhand","mountain plots for sale"}	t	2025-09-02 08:13:03.415989+00	2025-09-02 10:09:26.868+00	30.273427679299743	78.58326598206632
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.session (sid, sess, expire) FROM stdin;
5zVjqBpzu8YsgRHYrxeANl1ZEeDXyOnM	{"cookie":{"originalMaxAge":86400000,"expires":"2025-09-04T08:56:40.089Z","secure":false,"httpOnly":false,"path":"/"},"adminAuthenticated":true}	2025-09-04 08:58:09
1MWnUUCyhmkZTEYbvGfUGGUKcuGl59V2	{"cookie":{"originalMaxAge":86400000,"expires":"2025-09-03T10:05:57.214Z","secure":false,"httpOnly":false,"path":"/"},"adminAuthenticated":true}	2025-09-04 09:18:01
\.


--
-- Data for Name: site_visits; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.site_visits (id, name, mobile, email, preferred_date, plot_size, budget, created_at) FROM stdin;
c69226ce-b3b1-4965-886c-d246720f970a	naveen 	9958756657	navin.vashisth@us4group.com	2025-08-24	200-300	25-40L	2025-08-22 07:02:29.538358
c1a77ca5-9a23-43dd-8bff-69d4ddf7bb21	demo	8588834221	aryannjindal@gmail.com	2025-08-28	500-800	40-60L	2025-08-27 04:11:53.19001
5813f5d9-a19a-4409-bb1a-a210341d4364	Abc	6423456789		2025-08-25	300-500	25-40L	2025-08-31 15:37:53.887739
\.


--
-- Data for Name: testimonials; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.testimonials (id, name, location, investment, plot_size, returns, duration, review) FROM stdin;
68e6176c-e628-4839-afd2-6fa203d64a6f	Ashish	Delhi	1500000	400	18	18 months	good returns
b3626d72-bb13-43a8-9d1f-963954c47703	Sunita Verma	Chandigarh	950000	250	25	20 months	Amazing returns on my investment! The team guided me throughout the process. Very professional and trustworthy.
c23d5220-2dbd-4c8a-8583-8ed2b9039766	Vikash Kumar	Lucknow	1800000	500	19	24 months	Fantastic agricultural land with excellent infrastructure. The location near Dehradun is perfect for long-term growth.
b9116186-a920-4138-b3b0-a5c47aaacff1	Meera Joshi	Pune	650000	150	28	16 months	Excellent investment opportunity! The returns exceeded my expectations. Great customer service and transparent dealings.
6f35d90f-001e-4b6c-84ce-5cc137751f9a	Priya Mehta	Mumbai	4500000	500	22	2.5 years	Initially skeptical about agricultural land investment, but after visiting the site and seeing the infrastructure development, I was convinced. The regular updates and transparent communication from the team made the entire process smooth. My plot value has increased significantly and I'm planning to buy another one.
becd8c95-624e-48fd-aea5-f393c05fae43	Dr. Suresh Kumar	Gurgaon	2800000	350	19	20 months	As a doctor with limited time for investment research, I needed something reliable. Khushalipur exceeded my expectations. The legal documentation was thorough, the location is strategic, and the team's professionalism is commendable. The appreciation in land value has been steady and promising.
3124ac4d-3b54-46e0-83d4-4de4c2033473	Amit Singh	Noida	3200000	400	21	18 months	After losing money in stocks, I was looking for a stable investment. My friend recommended Khushalipur. The proximity to Delhi, good road connectivity, and clear legal titles convinced me. The team arranged multiple site visits and answered all my questions patiently. Very satisfied with the investment.
14db2661-e0fb-45a5-b148-27b0b1063c73	Neha Agarwal	Pune	1800000	250	17	14 months	Being a working professional, I wanted a hands-off investment. The team at Khushalipur handles everything - from documentation to updates on land development. The monsoon irrigation facility and soil quality reports gave me confidence. It's a good long-term investment for my daughter's future.
494e4c47-2b02-433f-9b5a-7c0ceae50ce2	Ravi Gupta	Bangalore	5200000	600	25	3 years	I've invested in multiple agricultural projects, but Khushalipur stands out. The master planning, amenities like club house and security, plus the government approvals make it a safe bet. The land prices in surrounding areas have increased by 40% in the past year alone.
488b5cb3-c3b5-4e78-8297-dc0169e0de95	Sunita Sharma	Delhi	2100000	300	18	16 months	My husband was initially hesitant, but after the site visit and meeting with the project team, we decided to invest. The transparent pricing, no hidden costs, and regular progress updates won our trust. The land is fertile and the location has good growth potential.
4d826fdb-3bd9-4a66-8ed2-435a562fe73b	Vijay Malhotra	Chandigarh	3800000	450	23	2 years	Retired from government service and wanted to invest my provident fund wisely. The agricultural land seemed like a good option for steady returns. The team's knowledge about farming, water table, and market trends impressed me. The investment has performed better than fixed deposits.
c0cea2ed-5b3d-4a5c-b02a-f338d849c7a2	Kavita Joshi	Jaipur	2600000	350	20	22 months	As a single working mother, I needed a secure investment for my son's education. The team understood my needs and recommended a plot size within my budget. The documentation process was handled professionally, and I receive regular updates about land development and market prices.
6bbac812-af01-4fc8-98ad-112f6228b2b4	Bhupendra Singh	Delhi	3600000	400	24	2 years	Very satisfied with my investment. The team is professional and transparent.
64523717-03ea-4d99-8a15-1e12c9b5da25	Sushil Jain	Delhi	2500000	300	20	15 months	Great project with excellent amenities. Highly recommend for long-term investment.
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, first_name, last_name, profile_image_url, role, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: videos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.videos (id, title, description, video_url, thumbnail_url, duration, category, created_at) FROM stdin;
2fb1f999-bafe-4cd9-91dc-f237fa98aed4	Project Video	Watch our project overview video	https://drive.google.com/file/d/12OIaXhanE8S2aoB1JQCwe00ODNLNVwsR/preview	https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450	2:27	project	2025-08-14 05:11:13.925458
\.


--
-- PostgreSQL database dump complete
--

