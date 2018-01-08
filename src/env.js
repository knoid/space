import querystring from 'querystring';

export const isMobile = 'ontouchstart' in window;

const query = querystring.parse(window.location.search.substring(1));
export const settings = {
  ball: {
    delay: Number(query.ball_delay) || 0.15,
    mass: Number(query.ball_mass) || 0.5,
    radius: Number(query.ball_radius) || 5,
  },
};
