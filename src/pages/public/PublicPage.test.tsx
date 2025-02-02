import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "../../redux/states/user"; // Подключаем твой редьюсер
import PublicPage from "./PublicPage";
import { vi } from "vitest";

// Заглушка для CharacterPage, чтобы тесты не грузили реальный компонент
vi.mock("./characters/CharacterPage", () => ({
    default: () => <div data-testid="character-page" />,
}));
// Функция для создания тестового Redux store
const renderWithStore = (userState: UserState) => {
    const store = configureStore({
        reducer: { user: userSlice.reducer },
        preloadedState: { user: userState },
    });

    return render(
        <Provider store={store}>
            <PublicPage />
        </Provider>
    );
};

test("Рендерит CharacterPage, если пользователь авторизован", () => {
    renderWithStore({ ...userSlice.getInitialState(), isAuth: true });

    expect(screen.getByTestId("character-page")).toBeInTheDocument();
});

test("Не рендерит CharacterPage, если пользователь НЕ авторизован", () => {
    renderWithStore({ ...userSlice.getInitialState(), isAuth: false });

    expect(screen.queryByTestId("character-page")).not.toBeInTheDocument();
});
