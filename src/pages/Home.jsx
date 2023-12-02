import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Header } from "../components/Header";
import { url } from "../const";
import "./home.scss";

export const Home = () => {
  const [isDoneDisplay, setIsDoneDisplay] = useState("todo"); // todo->未完了 done->完了
  const [lists, setLists] = useState([]);
  const [selectListId, setSelectListId] = useState(lists[0]?.id);
  const [tasks, setTasks] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [cookies] = useCookies();
  const handleIsDoneDisplayChange = (e) => setIsDoneDisplay(e.target.value);
  
  useEffect(() => {
    axios
      .get(`${url}/lists`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setLists(res.data);
      })
      .catch((err) => {
        setErrorMessage(`リストの取得に失敗しました。${err}`);
      });
  }, []);

  useEffect(() => {
    const listId = lists[0]?.id;
    if (typeof listId !== "undefined") {
      setSelectListId(listId);
      axios
        .get(`${url}/lists/${listId}/tasks`, {
          headers: {
            authorization: `Bearer ${cookies.token}`,
          },
        })
        .then((res) => {
          setTasks(res.data.tasks);
        })
        .catch((err) => {
          setErrorMessage(`タスクの取得に失敗しました。${err}`);
        });
    }
  }, [lists]);

  const handleSelectList = (id) => {
    setSelectListId(id);
    axios
      .get(`${url}/lists/${id}/tasks`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setTasks(res.data.tasks);
      })
      .catch((err) => {
        setErrorMessage(`タスクの取得に失敗しました。${err}`);
      });
  };

  const getListIndex = (listId) => {
    return lists.findIndex((list) => list.id === listId);
  };

  const handleKey = (event) => {
    const currentIndex = getListIndex(selectListId);

    if (event.key === "ArrowRight") {
      if (currentIndex > -1 && currentIndex < lists.length - 1) {
        setSelectListId(lists[currentIndex + 1].id);
      }
    } else if (event.key === "ArrowLeft") {
      if (currentIndex > 0 && currentIndex <= lists.length) {
        setSelectListId(lists[currentIndex - 1].id);
      }
    }
  };

  useEffect(() => {
    axios
      .get(`${url}/lists/${selectListId}/tasks`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setTasks(res.data.tasks);
      });
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [selectListId]);

  return (
    <div>
      <Header />
      <main className="taskList">
        <p className="error-message">{errorMessage}</p>
        <div>
          <div className="list-header">
            <h2>リスト一覧</h2>
            <div className="list-menu">
              <p>
                <Link to="/list/new">リスト新規作成</Link>
              </p>
              <p>
                <Link to={`/lists/${selectListId}/edit`}>
                  選択中のリストを編集
                </Link>
              </p>
            </div>
          </div>
          <ul className="list-tab">
            {lists.map((list, key) => {
              const isActive = list.id === selectListId;
              return (
                <li
                  key={key}
                  className={`list-tab-item ${isActive ? "active" : ""}`}
                  onClick={() => {
                    handleSelectList(list.id);
                    console.log(list.id);
                  }}
                >
                  {list.title}
                </li>
              );
            })}
          </ul>
          <div className="tasks">
            <div className="tasks-header">
              <h2>タスク一覧</h2>
              <Link to="/task/new">タスク新規作成</Link>
            </div>
            <div className="display-select-wrapper">
              <select
                onChange={handleIsDoneDisplayChange}
                className="display-select"
              >
                <option value="todo">未完了</option>
                <option value="done">完了</option>
              </select>
            </div>
            <Tasks
              tasks={tasks}
              selectListId={selectListId}
              isDoneDisplay={isDoneDisplay}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

const Tasks = (props) => {
  //limitから残り日数を返す関数

  const getTimeLimit = (limit) => {
    const deadline = new Date(limit);
    const deadlineHours = deadline.getHours();
    deadline.setHours(deadlineHours-9); //時差を修正
    const now = new Date();
    if (now > deadline) {
      return "期限が過ぎました";
    }

    // 目標日時と現在日時の差分を計算
    const timeDifference = deadline - now;

    // 残り時間を日数、時間、分に変換
    const remainingDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const remainingHours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const remainingMinutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60),
    );

    // 残り時間を指定のフォーマットで表示
    console.log(
      `残り時間は${remainingDays}日${remainingHours}時間${remainingMinutes}分`,
    );
    return `${remainingDays}日${remainingHours}時間${remainingMinutes}分`;
  };

  function formatDate(limit) {
    //YYYY-MM-DDTHH:MM:SSZを書き直す関数

    const year = limit.slice(0, 4);
    const month = limit.slice(5, 7);
    const day = limit.slice(8, 10);
    const hours = limit.slice(11, 13);
    const minutes = limit.slice(14, 16);

    const formattedDate = `${year}年${month}月${day}日 ${hours}時${minutes}分`;

    return formattedDate;
  }

  const { tasks, selectListId, isDoneDisplay } = props;
  if (tasks === null) return <></>;
  if (isDoneDisplay == "done") {
    return (
      <ul>
        {tasks
          .filter((task) => {
            return task.done === true;
          })
          .map((task, key) => {
            return (
              <li key={key} className="task-item">
                <Link
                  to={`/lists/${selectListId}/tasks/${task.id}`}
                  className="task-item-link"
                >
                  {task.done ? "完了" : "未完了"} ＜期限＞{" "}
                  {formatDate(task.limit)} <br />
                  {task.title}
                </Link>
              </li>
            );
          })}
      </ul>
    );
  }

  return (
    <ul>
      {tasks
        .filter((task) => {
          return task.done === false;
        })
        .map((task, key) => (
          <li key={key} className="task-item">
            <Link
              to={`/lists/${selectListId}/tasks/${task.id}`}
              className="task-item-link"
            >
              {task.done ? "完了" : "未完了"} ＜期限＞ {formatDate(task.limit)}{" "}
              ＜期限までの日時＞ {getTimeLimit(task.limit)}
              <br />
              {task.title}
              <br />
            </Link>
          </li>
        ))}
    </ul>
  );
};
