import { Bodies, Composites } from "matter-js";

const Block = (props) => {
  const { x, y, width, height } = props;

  const body = Bodies.rectangle(x, y, width, height, {
    isStatic: false,
    render: {
      fillStyle: "blue",
    },
  });

  return body;
};

const Floor = (props) => {
  const { x, y, width, height } = props;

  const body = Bodies.rectangle(x, y, width, height, {
    isStatic: true,
    render: {
      fillStyle: "white",
    },
  });

  return body;
};

const Bird = (props) => {
  const { x, y, radius } = props;

  const body = Bodies.circle(x, y, radius, {
    label: "bird",
    isStatic: true,
    density: 0.02,
    friction: 0.01,
    restitution: 0.6,
    render: {
      fillStyle: "red",
    },
  });

  return body;
};

const Pig = (props) => {
  const { x, y, radius } = props;

  const body = Bodies.circle(x, y, radius, {
    label: "pig",
    render: {
      fillStyle: "green",
    },
  });

  return body;
};

export { Block, Bird, Floor, Pig };
