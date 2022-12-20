import React, { useState, useEffect, createContext } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const GithubContext = createContext();

//provider ,consumer

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowrs] = useState(mockFollowers);
  //request loading
  const [request, setRequest] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  //error
  const [error, setError] = useState({ show: false, msg: "" });

  const searchGithubUser = async (user) => {
    // console.log(user)
    toggleError();
    setIsLoading(true);
    const response = await axios(`${rootUrl}/users/${user}`).catch((err) =>
      console.log(err)
    );
    // const response = await axios(`${rootUrl}/users/${user}`).catch((err) =>
    //   console.log(err)
    // );
    // if (response) {
    //   setGithubUser(response.data);
    //   const { login, followers_url } = response.data;
    //   //repos
    //   axios(`${rootUrl}/users/${login}/repos?per_page=100`).then((response) =>
    //     setRepos(response.data)
    //   );
    //   //followers
    //   axios(`${followers_url}?per_page=100`).then((response) =>
    //     setFollowrs(response.data)
    //   );
    // } else {
    //   toggleError(true, "there is no user with that username");
    // }
    //promise allSettled  all data comes at once means we display all data when its ready before request are not setteld in one so there is one data and another data ;below code is not necessary;all settled gives status and value;
    if (response) {
      setGithubUser(response.data);
      const { login, followers_url } = response.data;
      //repos

      await Promise.allSettled([
        axios(`${rootUrl}/users/${login}/repos?per_page=100`),
        axios(`${followers_url}?per_page=100`),
      ]).then((result) => {
        const [repos, followers] = result;
        const status = "fulfilled";
        if (repos.status === status) {
          setRepos(repos.value.data);
        }
        if (followers.status === status) {
          setFollowrs(followers.value.data);
        }
      });
    } else {
      toggleError(true, "there is no user with that username");
    }

    //not working code;
    // try {
    //   const response = await axios(`${rootUrl}/users/${user}`);
    //   if (response) {
    //     setGithubUser(response.data);
    //   }
    // } catch (error) {
    //   toggleError(true, "there is no user with that username");
    // }
    checkRequest();
    setIsLoading(false);
  };

  //check rate
  // const checkRequest = async () => {
  //   try {
  //     const { data } = await axios(`${rootUrl}/rate_limit`);
  //     let {
  //       rate: { remaining },
  //     } = data;
  //     setRequest(remaining);
  //     if (remaining === 0) {
  //       //throw error
  //       toggleError(true, "sorry,you have exceeded your hourly rate limit!");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const checkRequest = () => {
    axios(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        let {
          rate: { remaining },
        } = data;
        setRequest(remaining);
        if (remaining === 0) {
          toggleError(true, "sorry, you have exceeded your hourly rate limit!");
        }
      })
      .catch((err) => console.log(err));
  };

  function toggleError(show = false, msg = "") {
    setError({ show, msg });
  }
  useEffect(checkRequest, []);
  // get initial user
  useEffect(() => {
    searchGithubUser("MrYogesh0709");
  }, []);
  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        request,
        error,
        searchGithubUser,
        isLoading,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export { GithubContext, GithubProvider };
