--
-- PostgreSQL database dump
--

-- Dumped from database version 14.10
-- Dumped by pg_dump version 14.10 (Ubuntu 14.10-0ubuntu0.22.04.1)

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
-- Name: test; Type: DATABASE; Schema: -; Owner: abhishtchouhan
--

CREATE DATABASE test WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'C';


ALTER DATABASE test OWNER TO abhishtchouhan;

\connect test

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
-- Name: set_current_timestamp_updated_at(); Type: FUNCTION; Schema: public; Owner: abhishtchouhan
--

CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$;


ALTER FUNCTION public.set_current_timestamp_updated_at() OWNER TO abhishtchouhan;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: author; Type: TABLE; Schema: public; Owner: abhishtchouhan
--

CREATE TABLE public.author (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone_number text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    refresh_token_secret text NOT NULL,
    access_token_secret text NOT NULL,
    password_hash text NOT NULL
);


ALTER TABLE public.author OWNER TO abhishtchouhan;

--
-- Name: TABLE author; Type: COMMENT; Schema: public; Owner: abhishtchouhan
--

COMMENT ON TABLE public.author IS 'Author Base';


--
-- Name: books; Type: TABLE; Schema: public; Owner: abhishtchouhan
--

CREATE TABLE public.books (
    id text NOT NULL,
    title text NOT NULL,
    likes numeric NOT NULL,
    author_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.books OWNER TO abhishtchouhan;

--
-- Data for Name: author; Type: TABLE DATA; Schema: public; Owner: abhishtchouhan
--

COPY public.author (id, name, email, phone_number, created_at, updated_at, refresh_token_secret, access_token_secret, password_hash) FROM stdin;
1016b98d-1e02-414a-aed7-02b50fcc7851	Abhisht	abhishtchouhan@gmail.com	+917600501952	2024-01-10 05:55:13.536+00	2024-01-10 05:55:13.536+00	e5dcfb50c90003e5ecbdd8f7a55a5213da9d7ee9ce8c5d25476cc6355cd4b0eef7f80308b96db1634b6d0cf18ba3161e70d94a77c0be2cce94db275525276c3c	4a1fda1389e6539d9a7cf49a3a68fecf82eccac4cdbcbc4d53fa372b7ad87010a2ecb4c4344105ae0032094f6ca40a4a8376601551700d492636b762db45b1af	$2b$10$Q636rTFYCKHsaLqsQ6D2b.rUucPJG9UmtLuOM3.Y1gKrC8lwxxI8i
\.


--
-- Data for Name: books; Type: TABLE DATA; Schema: public; Owner: abhishtchouhan
--

COPY public.books (id, title, likes, author_id, created_at, updated_at) FROM stdin;
\.


--
-- Name: author author_access_token_secret_key; Type: CONSTRAINT; Schema: public; Owner: abhishtchouhan
--

ALTER TABLE ONLY public.author
    ADD CONSTRAINT author_access_token_secret_key UNIQUE (access_token_secret);


--
-- Name: author author_email_key; Type: CONSTRAINT; Schema: public; Owner: abhishtchouhan
--

ALTER TABLE ONLY public.author
    ADD CONSTRAINT author_email_key UNIQUE (email);


--
-- Name: author author_phone_number_key; Type: CONSTRAINT; Schema: public; Owner: abhishtchouhan
--

ALTER TABLE ONLY public.author
    ADD CONSTRAINT author_phone_number_key UNIQUE (phone_number);


--
-- Name: author author_pkey; Type: CONSTRAINT; Schema: public; Owner: abhishtchouhan
--

ALTER TABLE ONLY public.author
    ADD CONSTRAINT author_pkey PRIMARY KEY (id);


--
-- Name: author author_refresh_token_secret_key; Type: CONSTRAINT; Schema: public; Owner: abhishtchouhan
--

ALTER TABLE ONLY public.author
    ADD CONSTRAINT author_refresh_token_secret_key UNIQUE (refresh_token_secret);


--
-- Name: books books_pkey; Type: CONSTRAINT; Schema: public; Owner: abhishtchouhan
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_pkey PRIMARY KEY (id);


--
-- Name: author set_public_author_updated_at; Type: TRIGGER; Schema: public; Owner: abhishtchouhan
--

CREATE TRIGGER set_public_author_updated_at BEFORE UPDATE ON public.author FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_author_updated_at ON author; Type: COMMENT; Schema: public; Owner: abhishtchouhan
--

COMMENT ON TRIGGER set_public_author_updated_at ON public.author IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: books set_public_books_updated_at; Type: TRIGGER; Schema: public; Owner: abhishtchouhan
--

CREATE TRIGGER set_public_books_updated_at BEFORE UPDATE ON public.books FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_books_updated_at ON books; Type: COMMENT; Schema: public; Owner: abhishtchouhan
--

COMMENT ON TRIGGER set_public_books_updated_at ON public.books IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: books books_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: abhishtchouhan
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.author(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: DATABASE test; Type: ACL; Schema: -; Owner: abhishtchouhan
--

GRANT ALL ON DATABASE test TO neon_superuser;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: abhishtchouhan
--

REVOKE ALL ON SCHEMA public FROM cloud_admin;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO abhishtchouhan;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

