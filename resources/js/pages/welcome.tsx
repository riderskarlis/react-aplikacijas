import { Head, router } from '@inertiajs/react';
import { useState, type FormEvent } from 'react';

type Comment = {
    id: number;
    body: string;
    user: { name: string };
};

type Post = {
    id: number;
    title: string;
    body: string;
    user: { name: string };
    comments: Comment[];
};

type Props = {
    posts: Post[];
    auth: { user: { name: string } | null };
    errors: Record<string, string>;
};

export default function Welcome({ posts, auth, errors }: Props) {
    const [formType, setFormType] = useState('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [postTitle, setPostTitle] = useState('');
    const [postBody, setPostBody] = useState('');
    const [commentBody, setCommentBody] = useState('');
    const [commentPostId, setCommentPostId] = useState<number | null>(null);

    function submitLogin(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        router.post('/login', { email, password });
    }

    function submitRegister(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        router.post('/register', {
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
        });
    }

    function submitPost(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        router.post('/posts', { title: postTitle, body: postBody });
        setPostTitle('');
        setPostBody('');
    }

    function submitComment(event: FormEvent<HTMLFormElement>, postId: number) {
        event.preventDefault();
        router.post(`/posts/${postId}/comments`, { body: commentBody });
        setCommentBody('');
        setCommentPostId(null);
    }

    return (
        <>
            <Head title="Simple Blog" />
            <main className="blog">
                <header>
                    <a href="/">Simple Blog</a>
                    {auth.user && (
                        <span>
                            Hello, {auth.user.name}{' '}
                            <button onClick={() => router.post('/logout')}>Log out</button>
                        </span>
                    )}
                </header>

                {auth.user ? (
                    <form className="box" onSubmit={submitPost}>
                        <h2>New post</h2>
                        <input
                            value={postTitle}
                            onChange={(event) => setPostTitle(event.target.value)}
                            placeholder="Title"
                            required
                        />
                        <textarea
                            value={postBody}
                            onChange={(event) => setPostBody(event.target.value)}
                            placeholder="Write something..."
                            required
                        />
                        <button type="submit">Publish</button>
                        {errors.title && <p className="error">{errors.title}</p>}
                    </form>
                ) : (
                    <section className="box">
                        <h2>{formType === 'login' ? 'Log in' : 'Register'}</h2>

                        {formType === 'login' ? (
                            <form onSubmit={submitLogin}>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    placeholder="Email"
                                    required
                                />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    placeholder="Password"
                                    required
                                />
                                <button type="submit">Log in</button>
                            </form>
                        ) : (
                            <form onSubmit={submitRegister}>
                                <input
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    placeholder="Name"
                                    required
                                />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    placeholder="Email"
                                    required
                                />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    placeholder="Password"
                                    required
                                />
                                <input
                                    type="password"
                                    value={passwordConfirmation}
                                    onChange={(event) => setPasswordConfirmation(event.target.value)}
                                    placeholder="Confirm password"
                                    required
                                />
                                <button type="submit">Create account</button>
                            </form>
                        )}

                        {errors.email && <p className="error">{errors.email}</p>}
                        {errors.password && <p className="error">{errors.password}</p>}

                        <button
                            className="link-button"
                            onClick={() => setFormType(formType === 'login' ? 'register' : 'login')}
                        >
                            {formType === 'login' ? 'Need an account? Register' : 'Already registered? Log in'}
                        </button>
                    </section>
                )}

                <h1>Posts</h1>
                {posts.length === 0 && <p>No posts yet.</p>}

                {posts.map((post) => (
                    <article className="box" key={post.id}>
                        <h2>{post.title}</h2>
                        <p className="muted">By {post.user.name}</p>
                        <p className="post-body">{post.body}</p>

                        <h3>Comments</h3>
                        {post.comments.map((comment) => (
                            <p className="comment" key={comment.id}>
                                <strong>{comment.user.name}:</strong> {comment.body}
                            </p>
                        ))}

                        {auth.user && (
                            commentPostId === post.id ? (
                                <form onSubmit={(event) => submitComment(event, post.id)}>
                                    <input
                                        value={commentBody}
                                        onChange={(event) => setCommentBody(event.target.value)}
                                        placeholder="Write a comment"
                                        required
                                    />
                                    <button type="submit">Comment</button>
                                    <button type="button" onClick={() => setCommentPostId(null)}>Cancel</button>
                                </form>
                            ) : (
                                <button onClick={() => setCommentPostId(post.id)}>Add a comment</button>
                            )
                        )}
                    </article>
                ))}
            </main>
        </>
    );
}
