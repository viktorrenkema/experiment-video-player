import * as React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { THEME_TINT } from "../lib/constants";
import { podcasting } from "../lib/chapterTimestamps";

// Context imports
import { VideoID } from "../state/context";
import { GlobalState } from "../state/context";

const chapterCardVariants = {
  inactive: {
    backgroundColor: "#14181d",
  },
  active: {
    backgroundColor: "#161e24",
  },
};

export default function ChapterCard({
  chapterTitle,
  chapterDuration,
  id,
  index,
}) {
  // Context
  const [chapterPlaying, setChapterPlaying] = React.useContext(VideoID);
  const [playStatus, setPlayStatus] = React.useState(false);
  const [time, setTime] = React.useContext(GlobalState);
  // End contexts

  // Store the video html element
  const [videoElement, setVideoElement] = React.useState(null);
  // Store the video’s total duration
  const [videoDuration, setVideoDuration] = React.useState(null);

  // In useEffect so it only runs in browser -- find the video player and store it in a useState hook
  React.useEffect(() => {
    const documentVideo = document.getElementById("courseVideo");
    setVideoElement(documentVideo);

    // setInterval(function () {
    //   if (videoElement) {
    //     console.log("got the video");
    //     console.log(videoElement);
    //   } else if (!videoElement) {
    //     console.log("there's no video yet");
    //   }
    // }, 2000);

    // setVideoDuration(videoElement.duration);
  }, []);

  // Set the current Chapter, pass this as currenttime to video & play the video
  function playVid() {
    setChapterPlaying(id);
    setPlayStatus(true);
    videoElement.play();
    videoElement.currentTime = chapterDuration;
  }

  // Calculate and store (as boolean) if the current chapter also has a next chapter
  const hasNextChapter = () => {
    if (podcasting[index + 1]) return true;
    else return false;
  };

  // Set the current played Chapter depending on the current time running
  if (hasNextChapter) {
    if (time > chapterDuration && time < podcasting[index + 1]) {
      setChapterPlaying(id);
      console.log("current chapter set to ", id);
    } else if (time > chapterDuration) {
      setChapterPlaying(id);
      console.log("current chapter set to ", id);
    }
  }

  // Motion: Transforms for animating progress bar
  const width = useMotionValue(0);
  width.set(time);

  const timeInput = [chapterDuration, podcasting[index + 1]];
  // const timeInputLast = [chapterDuration, videoElement.duration];
  const output = [0, 350];

  const transformedWidth = useTransform(width, timeInput, output);
  // const transformedWidthLast = useTransform(width, timeInputLast, output);

  console.log("transformedWidth is ", transformedWidth);

  return (
    <>
      <motion.div
        className="chapterCard"
        variants={chapterCardVariants}
        animate={id === chapterPlaying ? "active" : "inactive"}
      >
        <div className="flexwraptext">
          <span className="textStyle1">{chapterTitle}</span>
          <span className="textStyle2">{`${chapterDuration} minuten`}</span>
        </div>{" "}
        <motion.div
          style={{
            width: transformedWidth,
            // width: hasNextChapter ? transformedWidth : transformedWidthLast,
            position: "absolute",
            height: "2px",
            marginTop: "58px",
            backgroundColor: "#01adfe4a",
          }}
        ></motion.div>
        <div className="flexwrapButton">
          <Play
            onClick={playVid}
            chapterPlaying={chapterPlaying}
            id={id}
          ></Play>
        </div>
      </motion.div>
    </>
  );
}

function Play({ onClick, id, chapterPlaying }) {
  const variantsLineOne = {
    play: {
      d: "M 7.5 2.86 L 7.5 15.86 L 15.5 9.5 Z",
      opacity: 1,
    },
    pause: {
      // d: "M 7.5 2.86 L 7.5 15.86 L 7.5 9.5 Z",
      opacity: 0,
    },
  };
  const variantsLineTwo = {
    play: {
      d: "M 15.5 2.86 L 15.5 15.86 L 15.5 9.5 Z",
      opacity: 0,
    },
    pause: {
      opacity: 0,
    },
  };

  return (
    <motion.svg
      onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="18"
      style={{ visibility: id === chapterPlaying ? "hidden" : "visible" }}
    >
      <motion.path
        fill={id === chapterPlaying ? `${THEME_TINT}` : "#E0E0E0"}
        stroke={id === chapterPlaying ? `${THEME_TINT}` : "#E0E0E0"}
        variants={variantsLineOne}
        animate={id === chapterPlaying ? "pause" : "play"}
        initial="play"
        strokeLinecap="round"
        strokeLinejoin="round"
        transition={{ ease: "linear", duration: 0.1 }}
        strokeWidth="2"
      ></motion.path>
      <motion.path
        fill={id === chapterPlaying ? `${THEME_TINT}` : "#E0E0E0"}
        stroke={id === chapterPlaying ? `${THEME_TINT}` : "#E0E0E0"}
        initial="play"
        variants={variantsLineTwo}
        animate={id === chapterPlaying ? "pause" : "play"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        transition={{ duration: 0.01 }}
      ></motion.path>
    </motion.svg>
  );
}
