import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./App.module.scss";
import { useQuery } from "@apollo/client";
import {
  Choice,
  Course,
  CoursesResponse,
  GET_COURSES,
  getOutcome,
  getSample,
  Sample,
} from "@/lib/api";

function App() {
  const [choice, setChoice] = useState<Choice | null>(null);
  const [sample, setSample] = useState<Sample | null>(null);
  const [, setLoading] = useState(true);

  const { data } = useQuery<CoursesResponse>(GET_COURSES);

  const courses = useMemo(() => data?.courseList, [data]);

  const parsedSample = useMemo(() => {
    if (!sample || !courses) return;

    return {
      ...sample,
      models: sample.results.map((result) => ({
        ...result,
        courses: result.courses.reduce((acc, match) => {
          const course = courses.find(
            (course) =>
              course.subject === match.subject && course.number === match.number
          );

          if (course) return [...acc, course];

          return acc;
        }, [] as Course[]),
      })),
    };
  }, [sample, courses]);

  const [recentSearches] = useState([
    "Search 5 search 5 seerch",
    "Search 4 search 4 seerch",
    "Search 3 search 3 seerch",
    "Search 2 search 2 seerch",
    "Search 1 search 1 seerch",
  ]);

  const initialize = useCallback(async () => {
    try {
      const sample = await getSample();
      setSample(sample);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    setLoading(true);

    initialize();

    setLoading(false);
  }, [initialize]);

  const handleClick = async (choice: Choice) => {
    if (!sample) return;

    setChoice(choice);
    setLoading(true);

    try {
      await getOutcome(
        sample.query,
        sample.results[0].model,
        sample.results[1].model,
        choice
      );

      const _sample = await getSample();
      setSample(_sample);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
    setChoice(null);
  };

  if (!parsedSample) return;

  return (
    <div className={styles["app-container"]}>
      {/* Sidebar */}
      <div className={styles["sidebar"]}>
        <h2>Berkeleytime</h2>
        <button className={styles["new-search-btn"]}>New Search</button>
        <div className={styles["recent-searches"]}>
          {recentSearches.map((search, index) => (
            <div className={styles["search-item"]} key={index}>
              {search}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className={styles["main-content"]}>
        {/* Query Display */}
        <div className={styles["query-display"]}>{parsedSample.query}</div>

        {/* Results */}
        <div className={styles["model-results"]}>
          {parsedSample.models.map((result, index) => (
            <div className={styles["model-column"]} key={result.model}>
              <h3>Results from Model {index === 0 ? "A" : "B"}</h3>
              {result.courses.map((course) => (
                <div
                  className={styles["course-result"]}
                  key={`${course.subject} ${course.number}`}
                >
                  <p className={styles["course-number"]}>
                    {course.subject} {course.number}
                  </p>
                  <p className={styles["course-title"]}>{course.title}</p>
                  <p>{course.description}</p>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Model comparison buttons */}
        <div className={styles["model-comparison"]}>
          <button
            className={`${styles["comparison-btn"]} ${
              choice === 1 ? styles["selected"] : ""
            }`}
            onClick={() => handleClick(1)}
          >
            👉 Model A is better
          </button>
          <button
            className={`${styles["comparison-btn"]} ${
              choice === 2 ? styles["selected"] : ""
            }`}
            onClick={() => handleClick(2)}
          >
            👉 Model B is better
          </button>
          <button
            className={`${styles["comparison-btn"]} ${
              choice === 0 ? styles["selected"] : ""
            }`}
            onClick={() => handleClick(0)}
          >
            🤝 Tie
          </button>
          <button
            className={`${styles["comparison-btn"]} ${
              choice === -1 ? styles["selected"] : ""
            }`}
            onClick={() => handleClick(-1)}
          >
            🛑 Both are bad
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
