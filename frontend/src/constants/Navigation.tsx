import HomePage from "../pages/Home";
import LoginPage from "../pages/Login";
import PlayPage from "../pages/Play";
import ProfilePage from "../pages/Profile";
import ResultsPage from "../pages/Results";

/**
 * TODO: Modify this constant to point to the URL of your backend.
 * It should be of the format "https://<app-name>.fly.dev/api"
 *
 * Most of the time, the name of your app is the name of the folder you're in
 * right now, and the name of your Git repository.
 * For instance, if that name is "my-app", then you should set this to:
 * "https://my-app.fly.dev/api"
 *
 * If you've already deployed your app (using `fly launch` or `fly deploy`),
 * you can find the name by running `flyctl status`, under App > Name.
 */
export const BACKEND_BASE_PATH = 'https://fa23-lec9-demo-soln.fly.dev/api';
// export const BACKEND_BASE_PATH = 'https://cornell_geoguesser.fly.dev/api';

export const PATHS: {
    link: string;
    label: string;
    element?: JSX.Element;
}[] = [
    {
        link: "/",
        label: "Login",
        element: <LoginPage />,
    },
    {
        link: "/home",
        label: "Home",
        element: <HomePage />,
    },
    {
        link: "/profile",
        label: "Profile",
        element: <ProfilePage />,
    },
    {
        link: "/play",
        label: "Play",
        element: <PlayPage />,
    },
    {
        link: "/results",
        label: "Results",
        element: <ResultsPage />,
    },
];
