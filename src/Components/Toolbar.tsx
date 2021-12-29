import { motion, useAnimation, useViewportScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { coinCount, isDark } from "../atom";

const Container = styled(motion.div)`
  position: fixed;
  z-index: 100;
  bottom: 0;
  left: 0;
  right: 0;
  height: 10vh;
  min-height: 80px;
  width: 100%;
  background-color: ${(props) => props.theme.toolbarColor};
  filter: drop-shadow(-5px 0 10px rgba(0, 0, 0, 0.1));
  border-radius: 20px 20px 0 0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-content: center;
  gap: 20px;
  padding: 0 20px;
  margin: 0 auto;
  @media (min-width: 600px) {
    width: 400px;
    bottom: 50px;
    border-radius: 20px;
  }
`;

const Btn = styled.div`
  cursor: pointer;
  width: 100%;
  height: 60px;
  background-color: ${(props) => props.theme.cardColor};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  font-size: 30px;
  transition: background-color 0.2s ease-in-out;
  @media (min-width: 600px) {
    &:hover {
      background-color: ${(props) => props.theme.accentColor};
    }
  }
  @media (max-width: 600px) {
    height: 50px;
    font-size: 22px;
  }
`;

function Toolbar() {
  const scrollHide = useAnimation();
  const setDark = useSetRecoilState(isDark);
  const { scrollY } = useViewportScroll();
  const setCount = useSetRecoilState(coinCount);
  useEffect(() => {
    let lastPos = scrollY.get();
    scrollY.onChange(() => {
      if (scrollY.get() < lastPos) {
        scrollHide.start({ y: 0 });
      }
      if (scrollY.get() > lastPos) {
        scrollHide.start({ y: 200 });
      }
      lastPos = scrollY.get();
    });
  }, [scrollY]);
  return (
    <Container
      initial={{ y: 0 }}
      animate={scrollHide}
      transition={{ duration: 0.2, type: "spring" }}
    >
      <Btn className="xi-moon" onClick={() => setDark((prev) => !prev)}></Btn>
      <Link to="/">
        <Btn className="xi-home"></Btn>
      </Link>
      <Btn className="xi-search"></Btn>
    </Container>
  );
}

export default Toolbar;
