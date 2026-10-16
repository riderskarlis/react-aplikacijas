import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Welcome from './welcome';

const { post } = vi.hoisted(() => ({ post: vi.fn() }));

vi.mock('@inertiajs/react', () => ({
    Head: () => null,
    router: { post },
}));

describe('Welcome page', () => {
    beforeEach(() => {
        post.mockClear();
    });

    it('shows the login form and allows switching to registration', () => {
        render(<Welcome posts={[]} auth={{ user: null }} errors={{}} />);

        expect(
            screen.getByRole('heading', { name: 'Log in' }),
        ).toBeInTheDocument();

        fireEvent.click(
            screen.getByRole('button', { name: 'Need an account? Register' }),
        );

        expect(
            screen.getByRole('heading', { name: 'Register' }),
        ).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText('Confirm password'),
        ).toBeInTheDocument();
    });

    it('submits the login credentials through Inertia', () => {
        render(<Welcome posts={[]} auth={{ user: null }} errors={{}} />);

        fireEvent.change(screen.getByPlaceholderText('Email'), {
            target: { value: 'user@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText('Password'), {
            target: { value: 'secret' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Log in' }));

        expect(post).toHaveBeenCalledWith('/login', {
            email: 'user@example.com',
            password: 'secret',
        });
    });
});
