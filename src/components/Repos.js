import React from "react";
import styled from "styled-components";
import { GithubContext } from "../context/context";
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from "./Charts";
const chartData = [
  {
    label: "HTML",
    value: "13",
  },
  {
    label: "CSS",
    value: "23",
  },
  {
    label: "JavaScript",
    value: "80",
  },
];
const Repos = () => {
  const { repos } = React.useContext(GithubContext);

  const languages = repos.reduce((total, item) => {
    // console.log(item);
    const { language, stargazers_count } = item;
    //this means if language is null do nothing return total;
    if (!language) return total;
    if (!total[language]) {
      // total[language] = 1;
      total[language] = { label: language, value: 1, stars: stargazers_count };
    } else {
      // total[language] = total[language] + 1;
      // total[language] = { label: language, value: total[language].value + 1 };
      // or
      total[language] = {
        ...total[language],
        value: total[language].value + 1,
        stars: total[language].stars + stargazers_count,
      };
    }
    //dynaimc pass object
    // total["object"] = 30;
    // total[language] = 30;
    return total;
  }, {});
  //now we have object of languages now turn back in to array and short so se can so only five most used languages;
  // console.log(languages);
  const moustUsed = Object.values(languages)
    .sort((a, b) => {
      return b.value - a.value;
    })
    .slice(0, 5);
  // console.log(moustUsed);

  //most stars per language;
  const mostPopuler = Object.values(languages)
    .sort((a, b) => {
      return b.stars - a.stars;
    })
    .map((item) => {
      return { ...item, value: item.stars };
    })
    .slice(0, 5);

  //stars and forks;
  let { stars, forks } = repos.reduce(
    (total, item) => {
      const { stargazers_count, name, forks } = item;
      total.stars[stargazers_count] = { label: name, value: stargazers_count };
      total.forks[forks] = { label: name, value: forks };
      return total;
    },
    {
      stars: {},
      forks: {},
    }
  );
  stars = Object.values(stars).slice(-5).reverse();
  forks = Object.values(forks).slice(-5).reverse();
  return (
    <section className="section">
      <Wrapper className="section-center">
        {/* <ExampleChart data={chartData} />; */}
        <Pie3D data={moustUsed} />
        <Column3D data={stars} />
        <Doughnut2D data={mostPopuler} />
        <Bar3D data={forks} />
      </Wrapper>
    </section>
  );
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
