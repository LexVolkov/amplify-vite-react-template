import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, vi } from "vitest";
import Router from "./routes";
import React from "react";

// Мокаем зависимости, чтобы тесты работали изолированно
vi.mock("../pages/public/PublicPage", () => ({
    default: () => <div data-testid="public-page" />,
}));
vi.mock("../pages/admin/AdminPage", () => ({
    default: () => <div data-testid="admin-page" />,
}));
vi.mock("../pages/profile/ProfilePage", () => ({
    default: () => <div data-testid="profile-page" />,
}));
vi.mock("../pages/control/ControlPage", () => ({
    default: () => <div data-testid="control-page" />,
}));
vi.mock("./ProtectedRoute", () => ({
    default: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="protected-route">{children}</div>
    ),
}));
vi.mock("@aws-amplify/ui-react", () => ({
    Authenticator: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="authenticator">{children}</div>
    ),
}));
vi.mock('@aws-amplify/ui-react', () => ({
    ...require('@aws-amplify/ui-react'),  // Правильно импортируем оригинальный модуль
    translations: {
        ua: {
            SignIn: {
                Username: 'Ім’я користувача',
                Password: 'Пароль',
                SignIn: 'Увійти',
            },
        },
    },
    Authenticator: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="authenticator">{children}</div>
    ),
}));



describe("Router", () => {
    it("должен рендерить PublicPage на /", () => {
        render(
            <MemoryRouter initialEntries={["/"]}>
                <Router />
            </MemoryRouter>
        );

        expect(screen.getByTestId("public-page")).toBeInTheDocument();
    });

    it("должен рендерить ProfilePage на /profile", () => {
        render(
            <MemoryRouter initialEntries={["/profile"]}>
                <Router />
            </MemoryRouter>
        );

        expect(screen.getByTestId("authenticator")).toBeInTheDocument();
        expect(screen.getByTestId("protected-route")).toBeInTheDocument();
        expect(screen.getByTestId("profile-page")).toBeInTheDocument();
    });

    it("должен рендерить ControlPage на /control", () => {
        render(
            <MemoryRouter initialEntries={["/control"]}>
                <Router />
            </MemoryRouter>
        );

        expect(screen.getByTestId("authenticator")).toBeInTheDocument();
        expect(screen.getByTestId("protected-route")).toBeInTheDocument();
        expect(screen.getByTestId("control-page")).toBeInTheDocument();
    });

    it("должен рендерить AdminPage на /admin", () => {
        render(
            <MemoryRouter initialEntries={["/admin"]}>
                <Router />
            </MemoryRouter>
        );

        expect(screen.getByTestId("authenticator")).toBeInTheDocument();
        expect(screen.getByTestId("protected-route")).toBeInTheDocument();
        expect(screen.getByTestId("admin-page")).toBeInTheDocument();
    });
});
