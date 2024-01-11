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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: books_like_activity; Type: TABLE; Schema: public; Owner: abhishtchouhan
--

CREATE TABLE public.books_like_activity (
    author_id text NOT NULL,
    book_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.books_like_activity OWNER TO abhishtchouhan;

--
-- Name: TABLE books_like_activity; Type: COMMENT; Schema: public; Owner: abhishtchouhan
--

COMMENT ON TABLE public.books_like_activity IS 'Books Likes Activity';


--
-- Data for Name: books_like_activity; Type: TABLE DATA; Schema: public; Owner: abhishtchouhan
--

COPY public.books_like_activity (author_id, book_id, created_at) FROM stdin;
\.


--
-- Name: books_like_activity books_like_activity_pkey; Type: CONSTRAINT; Schema: public; Owner: abhishtchouhan
--

ALTER TABLE ONLY public.books_like_activity
    ADD CONSTRAINT books_like_activity_pkey PRIMARY KEY (author_id, book_id);


--
-- Name: books_like_activity books_like_activity_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: abhishtchouhan
--

ALTER TABLE ONLY public.books_like_activity
    ADD CONSTRAINT books_like_activity_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.author(id) ON DELETE CASCADE;


--
-- Name: books_like_activity books_like_activity_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: abhishtchouhan
--

ALTER TABLE ONLY public.books_like_activity
    ADD CONSTRAINT books_like_activity_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE CASCADE;


--
-- Name: DATABASE test; Type: ACL; Schema: -; Owner: abhishtchouhan
--

GRANT ALL ON DATABASE test TO neon_superuser;


--
-- PostgreSQL database dump complete
--

