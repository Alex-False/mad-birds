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
import React, { useEffect, useRef } from "react";

function PhysicsEngine({ bodies }) {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);

  useEffect(() => {
    engineRef.current = Engine.create();

    let render = Render.create({
      element: sceneRef.current,
      engine: engineRef.current,
      options: {
        width: 2000,
        height: 750,
        wireframes: false,
      },
    });

    Render.run(render);

    var runner = Runner.create();
    Runner.run(runner, engineRef.current);

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engineRef.current, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });

    render.mouse = mouse;
    World.add(engineRef.current.world, mouseConstraint);

    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: 1000, y: 1000 },
    });

    let slingshotConstraint;

    Events.on(mouseConstraint, "mousedown", function (event) {
      if (bodies) {
        const body = Query.point(bodies, mouse.position)[0];
        if (body && body.label === "bird") {
          slingshotConstraint = Constraint.create({
            bodyA: body,
            pointB: { x: mouse.position.x, y: mouse.position.y },
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

    Events.on(engineRef, "collisionStart", function (event) {
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

  useEffect(() => {
    World.clear(engineRef.current.world, false);
    World.add(engineRef.current.world, bodies);
  }, [bodies]);

  return <div ref={sceneRef} />;
}

export default PhysicsEngine;
