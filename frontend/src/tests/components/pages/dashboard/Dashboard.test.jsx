import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Dashboard from "../../../../pages/dashboard/Dashboard.jsx";
import "@testing-library/jest-dom";

// --- Mocks for the route section components --- //
jest.mock("../../../../pages/dashboard/StatisticsSection.jsx", () => () => <div>Statistics Section</div>);
jest.mock("../../../../pages/dashboard/EmployeeSection.jsx", () => () => <div>Employee Section</div>);
jest.mock("../../../../pages/dashboard/UserSection.jsx", () => () => <div>User Section</div>);
jest.mock("../../../../pages/dashboard/BookingSection.jsx", () => () => <div>Booking Section</div>);
jest.mock("../../../../pages/dashboard/ThemeSection.jsx", () => (props) => <div>Theme Section</div>);

// --- Mock useMediaQuery to simulate mobile and desktop --- //
import useMediaQuery from "@mui/material/useMediaQuery";
jest.mock("@mui/material/useMediaQuery");

// --- Helper to render Dashboard inside a parent route --- //
const renderDashboard = (initialEntry, setThemeMock = jest.fn()) => {
    return render(
        <MemoryRouter initialEntries={[initialEntry]}>
            <Routes>
                <Route path="/dashboard/*" element={<Dashboard setTheme={setThemeMock} />} />
            </Routes>
        </MemoryRouter>
    );
};

describe("Dashboard Component", () => {
    const setThemeMock = jest.fn();

    beforeEach(() => {
        setThemeMock.mockClear();
    });

    describe("Desktop Layout (non-mobile)", () => {
        beforeEach(() => {
            // For desktop, simulate that the screen is not below the "md" breakpoint.
            useMediaQuery.mockImplementation(() => false);
        });

        test("renders desktop layout with persistent drawer and main content", () => {
            renderDashboard("/dashboard/", setThemeMock);

            // Check that all menu items are visible.
            expect(screen.getByText("Overview")).toBeInTheDocument();
            expect(screen.getByText("Employees")).toBeInTheDocument();
            expect(screen.getByText("Users")).toBeInTheDocument();
            expect(screen.getByText("Bookings")).toBeInTheDocument();
            expect(screen.getByText("Themes")).toBeInTheDocument();

            // Expect the default route to render the Statistics Section.
            expect(screen.getByText("Statistics Section")).toBeInTheDocument();
        });

        test("navigates to Employees route when clicking menu item", async () => {
            renderDashboard("/dashboard/", setThemeMock);

            // Click on the "Employees" menu item.
            fireEvent.click(screen.getByText("Employees"));

            // Wait for the Employee Section to load up.
            await waitFor(() => {
                expect(screen.getByText("Employee Section")).toBeInTheDocument();
            });
        });

        test("navigates to Users route when clicking menu item", async () => {
            renderDashboard("/dashboard/", setThemeMock);

            // Click on the "Users" menu item.
            fireEvent.click(screen.getByText("Users"));

            // Wait for the User Section to load up.
            await waitFor(() => {
                expect(screen.getByText("User Section")).toBeInTheDocument();
            });
        });

        test("navigates to Bookings route when clicking menu item", async () => {
            renderDashboard("/dashboard/", setThemeMock);

            // Click on the "Bookings" menu item.
            fireEvent.click(screen.getByText("Bookings"));

            // Wait for the Booking Section to load up.
            await waitFor(() => {
                expect(screen.getByText("Booking Section")).toBeInTheDocument();
            });
        });

        test("navigates to Themes route (passing the setTheme prop) when clicking menu item", async () => {
            renderDashboard("/dashboard/", setThemeMock);

            // Click on the "Themes" menu item.
            fireEvent.click(screen.getByText("Themes"));

            // Wait for the Theme Section to load up.
            await waitFor(() => {
                expect(screen.getByText("Theme Section")).toBeInTheDocument();
            });
        });
    });

    describe("Mobile Layout", () => {
        beforeEach(() => {
            // For mobile, simulate that the screen is below the "md" breakpoint.
            useMediaQuery.mockImplementation(() => true);
        });

        test("renders mobile layout with AppBar and temporary Drawer", () => {
            renderDashboard("/dashboard/", setThemeMock);

            // Expect an AppBar with a menu button (using aria-label "menu") to be present.
            const menuButton = screen.getByLabelText("menu");
            expect(menuButton).toBeInTheDocument();

            // Verify that the menu items are not visible before clicking the menu icon.
            expect(screen.queryByText("Employees")).not.toBeVisible();
            expect(screen.queryByText("Users")).not.toBeVisible();
            expect(screen.queryByText("Bookings")).not.toBeVisible();
            expect(screen.queryByText("Themes")).not.toBeVisible();
        });

        test("opens the drawer when menu icon is clicked and then navigates on menu item click for Employees", async () => {
            renderDashboard("/dashboard/", setThemeMock);

            // Open the temporary Drawer by clicking the menu icon.
            const menuButton = screen.getByLabelText("menu");
            fireEvent.click(menuButton);

            // Wait for the drawer content to appear.
            await waitFor(() => {
                expect(screen.getByText("Employees")).toBeInTheDocument();
            });

            // Click on the "Employees" menu item.
            fireEvent.click(screen.getByText("Employees"));

            // Wait for the Employee Section to load up.
            await waitFor(() => {
                expect(screen.getByText("Employee Section")).toBeInTheDocument();
            });
        });

        test("opens the drawer when menu icon is clicked and then navigates on menu item click for Users", async () => {
            renderDashboard("/dashboard/", setThemeMock);

            // Open the temporary Drawer by clicking the menu icon.
            const menuButton = screen.getByLabelText("menu");
            fireEvent.click(menuButton);

            // Wait for the drawer content to appear.
            await waitFor(() => {
                expect(screen.getByText("Users")).toBeInTheDocument();
            });

            // Click on the "Users" menu item.
            fireEvent.click(screen.getByText("Users"));

            // Wait for the User Section to load up.
            await waitFor(() => {
                expect(screen.getByText("User Section")).toBeInTheDocument();
            });
        });

        test("opens the drawer when menu icon is clicked and then navigates on menu item click for Bookings", async () => {
            renderDashboard("/dashboard/", setThemeMock);

            // Open the temporary Drawer by clicking the menu icon.
            const menuButton = screen.getByLabelText("menu");
            fireEvent.click(menuButton);

            // Wait for the drawer content to appear.
            await waitFor(() => {
                expect(screen.getByText("Bookings")).toBeInTheDocument();
            });

            // Click on the "Bookings" menu item.
            fireEvent.click(screen.getByText("Bookings"));

            // Wait for the Booking Section to load up.
            await waitFor(() => {
                expect(screen.getByText("Booking Section")).toBeInTheDocument();
            });
        });

        test("opens the drawer when menu icon is clicked and navigates to Themes route", async () => {
            renderDashboard("/dashboard/", setThemeMock);
            const menuButton = screen.getByLabelText("menu");

            // Open the temporary Drawer by clicking the menu icon.
            fireEvent.click(menuButton);

            // Wait for the drawer content to appear.
            await waitFor(() => {
                expect(screen.getByText("Themes")).toBeInTheDocument();
            });

            // Click on the "Themes" menu item.
            fireEvent.click(screen.getByText("Themes"));

            // Wait for the Theme Section to load up.
            await waitFor(() => {
                expect(screen.getByText("Theme Section")).toBeInTheDocument();
            });
        });
    });
});
