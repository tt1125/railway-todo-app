import React, { useState, useEffect } from "react";
export const Test = () => {
  //IDで番号しらべるやつ
  const jsonData = [
    {
      Name: "A",
      ID: "aaa",
    },
    {
      Name: "B",
      ID: "bbb",
    },
  ];

  const desiredID = "bbb";

  const index = jsonData.findIndex((item) => item.ID === desiredID);

  console.log(`"${desiredID}" の要素は配列内で ${index} 番目にあります`);

  //ボタンで選択するやつ

  const [selectedItem, setSelectedItem] = useState(0);
  const listItems = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"];

  const handleKeyDown = (event) => {
    if (event.key === "ArrowUp" && selectedItem !== null) {
      setSelectedItem((prevItem) => (prevItem > 0 ? prevItem - 1 : prevItem));
    } else if (event.key === "ArrowDown" && selectedItem !== null) {
      setSelectedItem((prevItem) =>
        prevItem < listItems.length - 1 ? prevItem + 1 : prevItem,
      );
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedItem]);

  return (
    <ul>
      {listItems.map((item, index) => (
        <li
          key={index}
          onClick={() => setSelectedItem(index)}
          style={{ backgroundColor: index === selectedItem ? "lightblue" : "" }}
        >
          {item}
        </li>
      ))}
    </ul>
  );
};

export default Test;
