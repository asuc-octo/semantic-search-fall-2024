import { useState } from "react";
import styles from "./App.module.scss";

function App() {
  const [recentSearches, setRecentSearches] = useState([
    "Search 5 search 5 seerch",
    "Search 4 search 4 seerch",
    "Search 3 search 3 seerch",
    "Search 2 search 2 seerch",
    "Search 1 search 1 seerch",
  ]);

  // State to track the selected button
  const [selectedButton, setSelectedButton] = useState(null);

  // Function to handle button click and set the selected button
  const handleButtonClick = (button) => {
    setSelectedButton(button);
  };

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
        <div className={styles["query-display"]}>
          SAMPLE QUERY
        </div>

        {/* Results */}
        <div className={styles["model-results"]}>
          <div className={styles["model-column"]}>
            <h3>Results from Model A</h3>
            <div className={styles["course-result"]}>
              <p className={styles["course-number"]}>COMPSCI 61A</p>
              <p className={styles["course-title"]}>Structure and Interpretation of Computer Programs</p>
              <p>An introduction to programming and computer science focused on abstraction techniques as means to manage program complexity. Techniques include procedural abstraction; control abstraction using recursion, higher-order functions, generators, and streams; data...</p>
            </div>
            <div className={styles["course-result"]}>
              <p className={styles["course-number"]}>COMPSCI 61B</p>
              <p className={styles["course-title"]}>Data Structures</p>
              <p>Fundamental dynamic data structures, including linear lists, queues, trees, and other linked structures; arrays strings, and hash tables. Storage management. Elementary principles of software engineering. Abstract data types...</p>
            </div>
            <div className={styles["course-result"]}>
              <p className={styles["course-number"]}>COMPSCI 61A</p>
              <p className={styles["course-title"]}>Structure and Interpretation of Computer Programs</p>
              <p>An introduction to programming and computer science focused on abstraction techniques as means to manage program complexity. Techniques include procedural abstraction; control abstraction using recursion, higher-order functions, generators, and streams; data...</p>
            </div>
            <div className={styles["course-result"]}>
              <p className={styles["course-number"]}>COMPSCI 61B</p>
              <p className={styles["course-title"]}>Data Structures</p>
              <p>Fundamental dynamic data structures, including linear lists, queues, trees, and other linked structures; arrays strings, and hash tables. Storage management. Elementary principles of software engineering. Abstract data types...</p>
            </div>
            <div className={styles["course-result"]}>
              <p className={styles["course-number"]}>COMPSCI 61A</p>
              <p className={styles["course-title"]}>Structure and Interpretation of Computer Programs</p>
              <p>An introduction to programming and computer science focused on abstraction techniques as means to manage program complexity. Techniques include procedural abstraction; control abstraction using recursion, higher-order functions, generators, and streams; data...</p>
            </div>
            <div className={styles["course-result"]}>
              <p className={styles["course-number"]}>COMPSCI 61B</p>
              <p className={styles["course-title"]}>Data Structures</p>
              <p>Fundamental dynamic data structures, including linear lists, queues, trees, and other linked structures; arrays strings, and hash tables. Storage management. Elementary principles of software engineering. Abstract data types...</p>
            </div>
            {/* Add more course results as needed */}
          </div>

          <div className={styles["model-column"]}>
            <h3>Results from Model B</h3>
            <div className={styles["course-result"]}>
              <p className={styles["course-number"]}>COMPSCI 61A</p>
              <p className={styles["course-title"]}>Structure and Interpretation of Computer Programs</p>
              <p>An introduction to programming and computer science focused on abstraction techniques as means to manage program complexity. Techniques include procedural abstraction; control abstraction using recursion, higher-order functions, generators, and streams; data...</p>
            </div>
            <div className={styles["course-result"]}>
              <p className={styles["course-number"]}>COMPSCI 61B</p>
              <p className={styles["course-title"]}>Data Structures</p>
              <p>Fundamental dynamic data structures, including linear lists, queues, trees, and other linked structures; arrays strings, and hash tables. Storage management. Elementary principles of software engineering. Abstract data types...</p>
            </div>
            <div className={styles["course-result"]}>
              <p className={styles["course-number"]}>COMPSCI 61A</p>
              <p className={styles["course-title"]}>Structure and Interpretation of Computer Programs</p>
              <p>An introduction to programming and computer science focused on abstraction techniques as means to manage program complexity. Techniques include procedural abstraction; control abstraction using recursion, higher-order functions, generators, and streams; data...</p>
            </div>
            <div className={styles["course-result"]}>
              <p className={styles["course-number"]}>COMPSCI 61B</p>
              <p className={styles["course-title"]}>Data Structures</p>
              <p>Fundamental dynamic data structures, including linear lists, queues, trees, and other linked structures; arrays strings, and hash tables. Storage management. Elementary principles of software engineering. Abstract data types...</p>
            </div>
            <div className={styles["course-result"]}>
              <p className={styles["course-number"]}>COMPSCI 61A</p>
              <p className={styles["course-title"]}>Structure and Interpretation of Computer Programs</p>
              <p>An introduction to programming and computer science focused on abstraction techniques as means to manage program complexity. Techniques include procedural abstraction; control abstraction using recursion, higher-order functions, generators, and streams; data...</p>
            </div>
            <div className={styles["course-result"]}>
              <p className={styles["course-number"]}>COMPSCI 61B</p>
              <p className={styles["course-title"]}>Data Structures</p>
              <p>Fundamental dynamic data structures, including linear lists, queues, trees, and other linked structures; arrays strings, and hash tables. Storage management. Elementary principles of software engineering. Abstract data types...</p>
            </div>
            {/* Add more course results as needed */}
          </div>
        </div>

        {/* Model comparison buttons */}
        <div className={styles["model-comparison"]}>
          <button
            className={`${styles["comparison-btn"]} ${selectedButton === "modelA" ? styles["selected"] : ""}`}
            onClick={() => handleButtonClick("modelA")}
          >
            👉 Model A is better
          </button>
          <button
            className={`${styles["comparison-btn"]} ${selectedButton === "modelB" ? styles["selected"] : ""}`}
            onClick={() => handleButtonClick("modelB")}
          >
            👉 Model B is better
          </button>
          <button
            className={`${styles["comparison-btn"]} ${selectedButton === "tie" ? styles["selected"] : ""}`}
            onClick={() => handleButtonClick("tie")}
          >
            🤝 Tie
          </button>
          <button
            className={`${styles["comparison-btn"]} ${selectedButton === "bothBad" ? styles["selected"] : ""}`}
            onClick={() => handleButtonClick("bothBad")}
          >
            🛑 Both are bad
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
