--
-- PostgreSQL database dump
--

\restrict 2vfXjFCWX1BKRc8TS9BpbfWtmkAxFrGA3XiZikbG6DHfyp8kiFQcZ0PV4D8mxHS

-- Dumped from database version 16.14
-- Dumped by pg_dump version 16.14

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
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."User" (id, email, phone, name, "passwordHash", role, "is2faEnabled", "steamId", "discordId", "createdAt", "updatedAt", "tradeUrl") FROM stdin;
9a803993-bf47-4a5e-a3fe-46399ca3fd17	khalidbinalam250@gmail.com	01883287443	Khalid Bin Alam	$argon2id$v=19$m=19456,t=2,p=1$HfqNutduGNr7Zk5MbyoJrA$lEb3pTVXyBgXZ2WVRfg4w5Cgk5kFdWLE2odrd2Rmmbc	SELLER_APPLICANT	f	\N	\N	2026-08-06 14:22:40.243	2026-08-06 14:22:40.243	\N
89924ec0-21a8-4935-a72f-389c33bc4c84	buyer@underground.bd	\N	Demo Buyer	$argon2id$v=19$m=19456,t=2,p=1$r5304IWT16CqIY4kOIUWlg$OlFIHdh8sWrvBNh9taDxr73L0iyefkyQa3eRnyHhhs0	USER	f	\N	\N	2026-08-06 14:26:23.701	2026-08-06 14:26:23.701	\N
5b28b65d-ed64-4e90-a59a-14347e507abb	seller@underground.bd	\N	Demo Seller	$argon2id$v=19$m=19456,t=2,p=1$r5304IWT16CqIY4kOIUWlg$OlFIHdh8sWrvBNh9taDxr73L0iyefkyQa3eRnyHhhs0	SELLER	f	\N	\N	2026-08-06 14:26:23.739	2026-08-06 14:26:23.739	\N
e0b6b640-402a-429b-b9e6-01ce795f5c1c	applicant@underground.bd	\N	Demo Applicant	$argon2id$v=19$m=19456,t=2,p=1$r5304IWT16CqIY4kOIUWlg$OlFIHdh8sWrvBNh9taDxr73L0iyefkyQa3eRnyHhhs0	SELLER_APPLICANT	f	\N	\N	2026-08-06 14:26:23.743	2026-08-06 14:26:23.743	\N
b76a5c7b-a80e-47e1-b6e6-94d62dfe7e23	moderator@underground.bd	\N	Demo Moderator	$argon2id$v=19$m=19456,t=2,p=1$r5304IWT16CqIY4kOIUWlg$OlFIHdh8sWrvBNh9taDxr73L0iyefkyQa3eRnyHhhs0	MODERATOR	f	\N	\N	2026-08-06 14:26:23.748	2026-08-06 14:26:23.748	\N
125da909-66a4-4c17-91da-378a92e23f7f	support@underground.bd	\N	Demo Support	$argon2id$v=19$m=19456,t=2,p=1$r5304IWT16CqIY4kOIUWlg$OlFIHdh8sWrvBNh9taDxr73L0iyefkyQa3eRnyHhhs0	SUPPORT	f	\N	\N	2026-08-06 14:26:23.753	2026-08-06 14:26:23.753	\N
ac047413-223b-4169-b365-0e273d39f59b	admin@underground.bd	\N	Demo Admin	$argon2id$v=19$m=19456,t=2,p=1$r5304IWT16CqIY4kOIUWlg$OlFIHdh8sWrvBNh9taDxr73L0iyefkyQa3eRnyHhhs0	ADMIN	f	\N	\N	2026-08-06 14:26:23.757	2026-08-06 14:26:23.757	\N
2148764e-630a-4402-8327-208d15b848ec	76561198773204519@steam.underground	\N	CS2SKINS.GIFT	\N	USER	f	76561198773204519	\N	2026-08-06 13:52:44.991	2026-08-06 14:37:05.76	https://steamcommunity.com/tradeoffer/new/?partner=812938791&token=FtebYAYW
\.


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Session" (id, "userId", "expiresAt", "sessionToken", "ipAddress", "userAgent", "createdAt") FROM stdin;
\.


--
-- Data for Name: Store; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Store" (id, "userId", slug, name, description, "bannerMediaId", "avatarMediaId", "trustScore", "verifiedAt", "kycStatus", "bankDetails", "payoutMethods", "createdAt", "updatedAt") FROM stdin;
\.


--
-- PostgreSQL database dump complete
--

\unrestrict 2vfXjFCWX1BKRc8TS9BpbfWtmkAxFrGA3XiZikbG6DHfyp8kiFQcZ0PV4D8mxHS

