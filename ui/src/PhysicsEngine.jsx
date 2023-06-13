import React, { useEffect, useRef, useMemo } from "react";
import {
  Engine,
  Render,
  World,
  Mouse,
  Bodies,
  MouseConstraint,
  Runner,
  Body,
  Events,
  Query,
  Constraint,
} from "matter-js";

function PhysicsEngine({ bodies }) {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const renderRef = useRef(null);
  let slingshotConstraint;
  let mouseConstraint;

  useEffect(() => {
    engineRef.current = Engine.create();

    renderRef.current = Render.create({
      element: sceneRef.current,
      engine: engineRef.current,
      options: {
        width: 2000,
        height: 750,
        wireframes: false,
      },
    });

    Render.run(renderRef.current);

    var runner = Runner.create();
    Runner.run(runner, engineRef.current);

    const mouse = Mouse.create(renderRef.current.canvas);
    mouseConstraint = MouseConstraint.create(engineRef.current, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });

    renderRef.current.mouse = mouse;
    World.add(engineRef.current.world, bodies);
    World.add(engineRef.current.world, mouseConstraint);

    Render.lookAt(renderRef.current, {
      min: { x: 0, y: 0 },
      max: { x: 1000, y: 1000 },
    });

    Events.on(mouseConstraint, "mousedown", function (event) {
      if (bodies) {
        const body = Query.point(bodies, mouse.position)[0];
        if (body && body.label === "bird") {
          slingshotConstraint = Constraint.create({
            bodyA: body,
            pointB: {
              x: mouse.position.x,
              y: mouse.position.y,
            },
            stiffness: 0.05,
            damping: 0.01,
            length: 0,
          });
          Body.setStatic(body, false);
          World.add(engineRef.current.world, slingshotConstraint);
        }
      }
    });

    Events.on(mouseConstraint, "mouseup", function (event) {
      if (slingshotConstraint) {
        const forceVector = {
          x:
            (slingshotConstraint.pointB.x -
              slingshotConstraint.bodyA.position.x) *
            0.015,
          y:
            (slingshotConstraint.pointB.y -
              slingshotConstraint.bodyA.position.y) *
            0.015,
        };
        Body.setStatic(slingshotConstraint.bodyA, false);
        Body.applyForce(
          slingshotConstraint.bodyA,
          slingshotConstraint.bodyA.position,
          forceVector
        );
        World.remove(engineRef.current.world, slingshotConstraint);
        slingshotConstraint = null;
      }
    });

    Events.on(engineRef.current, "collisionStart", function (event) {
      for (let pair of event.pairs) {
        if (
          (pair.bodyA.label === "pig" && pair.bodyB.label === "bird") ||
          (pair.bodyA.label === "bird" && pair.bodyB.label === "pig")
        ) {
          World.remove(
            engineRef.current.world,
            pair.bodyA.label === "pig" ? pair.bodyA : pair.bodyB
          );
        }
      }
    });
  }, []);

  mouseConstraint = useMemo(() => {
    if (sceneRef.current && engineRef.current && renderRef.current) {
      const mouse = Mouse.create(renderRef.current.canvas);
      return MouseConstraint.create(engineRef.current, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: { visible: false },
        },
      });
    } else {
      return null;
    }
  }, [bodies]);

  useEffect(() => {
    if (engineRef.current) {
      World.clear(engineRef.current.world, false);
      World.add(engineRef.current.world, bodies);
      if (mouseConstraint) {
        const { mouse, constraint } = mouseConstraint;
        engineRef.current.mouse = mouse;
        World.add(engineRef.current.world, constraint);
      }
    }
  }, [bodies, mouseConstraint]);

  return <div ref={sceneRef} />;
}

export default PhysicsEngine;
