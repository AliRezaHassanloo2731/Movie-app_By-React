import { useState } from "react";
import { IoMdStarOutline } from "react-icons/io";
import { FaStar } from "react-icons/fa";

const containertStyles = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
};

const starContainerStyle = {
  display: "flex",
  gap: "0.2rem",
};

function StarRating({
  maxRating = 5,
  color = "#ffde36",
  size = 24,
  messsages = [],
}) {
  const [rating, setRating] =
    useState(0);
  const [tempRating, setTempRating] =
    useState(0);

  const textStyle = {
    lineHeight: "1",
    margin: "0",
    color,
    size: `${size}rem`,
  };

  return (
    <div style={containertStyles}>
      <div style={starContainerStyle}>
        {Array.from(
          { length: maxRating },
          (_, idx) => idx + 1
        ).map((num) => (
          <Star
            color={color}
            size={size}
            key={num}
            onRate={() =>
              setRating(num)
            }
            onHoverIN={() =>
              setTempRating(num)
            }
            onHoverOut={() =>
              setTempRating(0)
            }
            full={
              tempRating
                ? tempRating >= num
                : rating >= num
            }
          />
        ))}
      </div>
      <p style={textStyle}>
        {messsages.length === maxRating
          ? messsages[rating]
          : tempRating || rating || ""}
      </p>
      {/* <button className="btn-add">
        Add to list
      </button> */}
    </div>
  );
}
function Star({
  onRate,
  color,
  size,
  full,
  onHoverIN,
  onHoverOut,
}) {
  const starStyle = {
    width: `${size}rem`,
    height: `${size}rem`,
    color: color,
    cursor: "pointer",
  };

  return (
    <span
      onClick={onRate}
      onMouseEnter={onHoverIN}
      onMouseLeave={onHoverOut}
    >
      {full ? (
        <FaStar style={starStyle} />
      ) : (
        <IoMdStarOutline
          style={starStyle}
        />
      )}
    </span>
  );
}

export default StarRating;
