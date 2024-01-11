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