"use client";
import React, { useState, useEffect } from "react";

const Bird = () => {
  const [birds, setBirds] = useState([]);
  const [isClicked, setIsClicked] = useState();

  const birdClicked = (bird) => {
    if (isClicked && isClicked == bird) {
      setIsClicked(null);
    } else {
      setIsClicked(bird);
    }
  };

  useEffect(() => {
    const fetchBirds = async () => {
      try {
        const response = await fetch("/api/birds");
        const data = await response.json();
        setBirds(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBirds();
  }, []);

  return (
    <main>
      <div className="site-header">
        <h1>Birds!</h1>
        <h3>The site about birds for birds</h3>
      </div>
      <div className="bird-info-container">
        {birds.length > 0 ? (
          birds.map((bird) => {
            return (
              <div
                className={`bird-card ${isClicked === bird ? "clicked" : ""}`}
                onClick={() => birdClicked(bird)}
              >
                <h1 className="bird-name">{bird.name}</h1>
                {isClicked == bird ? (
                  bird.characteristics ? (
                    Object.keys(bird.characteristics).map((char) => {
                      return (
                        <p>
                          {char.replace(/_/g, " ")}:{" "}
                          {char === "color"
                            ? bird.characteristics[char]
                                .match(/[A-Z][a-z]+/g)
                                .map((value) => `${value} `)
                            : bird.characteristics[char]}
                        </p>
                      );
                    })
                  ) : (
                    <p>No characteristics available</p>
                  )
                ) : null}
              </div>
            );
          })
        ) : (
          <p>There are no birds... :c</p>
        )}
      </div>
    </main>
  );
};

export default Bird;
