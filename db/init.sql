DO $$ 
BEGIN 
  RAISE NOTICE 'Executing 1 init.sql...';
END $$;

-- Drop existing tables (if they exist) 
DO $$ 
BEGIN
  EXECUTE 'DROP SCHEMA IF EXISTS public CASCADE';
  EXECUTE 'CREATE SCHEMA public';
END $$;


-- CREATE UPDATED_AT FUNCTION

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


-- CREATE AUTHOR TABLE
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
COMMENT ON TABLE public.author IS 'Author Base';

-- CREATE BOOK TABLE
CREATE TABLE public.books (
    id text NOT NULL,
    title text NOT NULL,
    likes numeric NOT NULL,
    author_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.books IS 'Book Base';

-- Add Constraint


ALTER TABLE ONLY public.author
    ADD CONSTRAINT author_access_token_secret_key UNIQUE (access_token_secret);


ALTER TABLE ONLY public.author
    ADD CONSTRAINT author_refresh_token_secret_key UNIQUE (refresh_token_secret);


ALTER TABLE ONLY public.author
    ADD CONSTRAINT author_email_key UNIQUE (email);

ALTER TABLE ONLY public.author
    ADD CONSTRAINT author_phone_number_key UNIQUE (phone_number);


ALTER TABLE ONLY public.author
    ADD CONSTRAINT author_pkey PRIMARY KEY (id);


ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.author(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


-- ATTACH TRIGGER


CREATE TRIGGER set_public_author_updated_at BEFORE UPDATE ON public.author FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

COMMENT ON TRIGGER set_public_author_updated_at ON public.author IS 'trigger to set value of column "updated_at" to current timestamp on row update';


CREATE TRIGGER set_public_books_updated_at BEFORE UPDATE ON public.books FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

COMMENT ON TRIGGER set_public_books_updated_at ON public.books IS 'trigger to set value of column "updated_at" to current timestamp on row update';



-- CREATE BOOKS_LIKE_ACTIVITY TABLE
CREATE TABLE public.books_like_activity (
    author_id text NOT NULL,
    book_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.books_like_activity IS 'Books Likes Activity';

-- Add Constraint
ALTER TABLE ONLY public.books_like_activity
    ADD CONSTRAINT books_like_activity_pkey PRIMARY KEY (author_id, book_id);

-- Add FOREIGN KEY

ALTER TABLE ONLY public.books_like_activity
    ADD CONSTRAINT books_like_activity_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.author(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.books_like_activity
    ADD CONSTRAINT books_like_activity_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE CASCADE;