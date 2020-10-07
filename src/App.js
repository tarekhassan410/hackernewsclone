import React from "react";
import ContentLoader from "react-content-loader";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [posts, setPosts] = React.useState([]);
  const [darktheme, setDarkTheme] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchHackerNewsPosts() {
      try {
        // it waits this function
        let postsIDsArray = await fetch(
          "https://hacker-news.firebaseio.com/v0/topstories.json"
        )
          .then((res) => res.json())
          .then((result) => {
            return result;
          });

        const promises = postsIDsArray
          .slice(0, 50)
          .map((id) =>
            fetch(
              `https://hacker-news.firebaseio.com/v0/item/${id}.json`
            ).then((response) => response.json())
          );
        const result = await Promise.all(promises);
        await setLoading(false);
        setPosts(result);
      } catch (error) {
        console.log(error);
      }
    }

    fetchHackerNewsPosts();
  }, []);

  const changeTheme = () => {
    console.log(darktheme);
    setDarkTheme((darktheme) => !darktheme);
  };

  console.log(loading);

  return (
    <div
      className={
        darktheme == true
          ? "p-10 bg-gray-900 transition-all duration-200	ease-linear"
          : "p-10 bg-gray-200 transition-all duration-200	ease-linear"
      }
    >
      <header className="flex flex-row justify-between items-center">
        <h1 className="text-2xl font-bold text-green-500"> Hacker news API </h1>
        <div className="text-white">
          <input
            onChange={() => changeTheme()}
            type="checkbox"
            id="checkbox"
            value="checked"
            className="checkbox"
          />
          <label htmlFor="checkbox" className="label">
            <i className="fas fa-sun" />
            <i className="fas fa-moon" />
            <div className="ball"></div>
          </label>
        </div>
      </header>
      {loading == true ? (
        <ContentLoader>
          <rect x="0" y="40" rx="3" ry="3" width="250" height="20" />
          <rect x="0" y="80" rx="3" ry="3" width="250" height="20" />
          <rect x="0" y="120" rx="3" ry="3" width="250" height="20" />
        </ContentLoader>
      ) : (
        <div className="">
          <ul>
            {posts.map((post) => (
              <li
                className="text-lg font-bold my-4 text-orange-500"
                key={post.id}
              >
                <a href={post.url}>{post.title}.</a>
                <span className={darktheme ? "text-white" : "text-black"}>
                  {" "}
                  {post.score}{" "}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
