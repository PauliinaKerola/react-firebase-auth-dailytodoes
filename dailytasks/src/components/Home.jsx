import React from "react";
import { useState, useEffect } from "react";
import happy from "../assets/happy.jpg";
import { db, auth } from "../Config/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import logo from "../assets/logo.png";

import { GoKebabVertical } from "react-icons/go";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

import {
  faAdd,
  faCircleCheck,
  faPen,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

import {
  getDocs,
  deleteDoc,
  updateDoc,
  collection,
  doc,
  addDoc,
  query,
  orderBy,
  limit,
  startAfter,
  endBefore,
} from "firebase/firestore";

export const Home = () => {
  const [user, setUser] = useState({});
  const [date, setDate] = useState(null);
  const [year, setYear] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(null);

  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);

  const [updatedTask, setupdatedTask] = useState();
  const [editId, setEditId] = useState("");
  const [task, setTask] = useState("");

  const [registrationError, setRegistrationError] = useState("");

  const tasksCollectionRef = collection(db, "tasks");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      getTasks();
    }
  }, [user]);

  useEffect(() => {
    getCurrentMonth();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
        navigate("/login");
      }
    });
    return unsubscribe;
  }, []);

  // const getTasks = async () => {
  //   try {
  //     const data = await getDocs(tasksCollectionRef);
  //     const filteredData = data.docs.map((doc) => ({
  //       ...doc.data(),
  //       id: doc.id,
  //     }));
  //     filteredData.sort((a, b) => a.createdAt - b.createdAt);
  //     setTasks(filteredData);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const getTasks = async () => {
    try {
      const tasksQuery = query(
        tasksCollectionRef,
        orderBy("createdAt", "desc")
      );

      const tasksSnapshot = await getDocs(tasksQuery);

      const filteredTasks = tasksSnapshot.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }))
        .filter((task) => task.userId === auth?.currentUser?.uid);

      setTasks(filteredTasks);
    } catch (err) {
      console.error(err);
    }
  };

  const selectPageHandle = (selectedPage) => {
    // Pagination Logic
    if (
      selectedPage >= 1 &&
      selectedPage <= Math.ceil(tasks.length / 5) &&
      selectedPage !== page
    ) {
      setPage(selectedPage);
    }
  };

  const getCurrentMonth = () => {
    const months = [
      "Tammikuu",
      "Helmikuu",
      "Maaliskuu",
      "Huhtikuu",
      "Toukokuu",
      "Kesäkuu",
      "Heinäkuu",
      "Elokuu",
      "Syyskuu",
      "Lokakuu",
      "Marraskuu",
      "Joulukuu",
    ];
    const myDate = new Date();
    const monthIndex = myDate.getMonth();
    const currentMonth = months[monthIndex];
    const myDate2 = myDate.getDate();
    const myYear = myDate.getFullYear();
    const myDay = myDate.toLocaleDateString("default", { weekday: "long" });
    setCurrentMonth(currentMonth);
    setDate(myDate2);
    setYear(myYear);
  };

  const handleEdit = (id) => {
    const task = tasks.find((task) => task.id === id);
    setEditId(id);
    setupdatedTask(task.title);
  };

  const handleUpdate = async () => {
    try {
      const taskDoc = doc(db, "tasks", editId);
      await updateDoc(taskDoc, { title: updatedTask });
      setEditId("");
      setupdatedTask("");
      getTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // const handleUpdate = async (id) => {
  //   const taskDoc = doc(db, "tasks", id);
  //   await updateDoc(taskDoc, { title: updatedTask });
  //   getTasks();
  // };

  const cancelUpdate = () => {
    setupdatedTask("");
  };

  const deleteTask = async (id) => {
    const taskDoc = doc(db, "tasks", id);
    await deleteDoc(taskDoc);
    getTasks();
  };

  const taskCompleted = (id) => {
    // let newTask = toDo.map((task) => {
    //   if (task.id == id) {
    //     return { ...task, status: !task.status };
    //   }
    //   return task;
    // });
    // setToDo(newTask);

    //refactored
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };

  // const onSubmitTask = async () => {
  //   if (!task) {
  //     setRegistrationError("Tehtävää ei voi jättää tyhjäksi.");
  //     return;
  //   }
  //   try {
  //     await addDoc(tasksCollectionRef, {
  //       title: task,
  //       userId: auth?.currentUser?.uid,
  //       createdAt: new Date().getTime(),
  //     });
  //     setTask("");
  //     getTasks();
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const onSubmitTask = async () => {
    if (!task) {
      setRegistrationError("Tehtävää ei voi jättää tyhjäksi.");
      return;
    }

    try {
      await addDoc(tasksCollectionRef, {
        title: task,
        userId: auth?.currentUser?.uid,
        createdAt: new Date().getTime(),
      });
      setTask("");
      setRegistrationError("");
      getTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="tasks-container">
      <div className="task-container">
        <div className="welcome-section">
          <div className="logo">
            <img src={logo} className="logo" />
          </div>
          <h2>Miltä tehtävälistasi näyttää, </h2>
          <h3 className="namebox-name">{auth?.currentUser?.email}</h3>
          <p className="date-section">
            Tänään on
            <span> {date}.</span>
            <span> {currentMonth}ta</span>
            <span> {year}.</span>
          </p>
        </div>

        {/* Display toDos */}
        <div className="notasks-message">
          {tasks && tasks.length ? (
            ""
          ) : (
            <div className="notasks-image">
              <img src={happy} alt="image_description" />
              <div className="notasks-message">
                <b>Sinulla ei ole yhtään tehtävää.</b>
              </div>
            </div>
          )}
        </div>

        {tasks.slice(page * 5 - 5, page * 5).map((task, key) => {
          let totalTasksDisplayed = (page - 1) * 5 + key + 1;

          return (
            <div className="taskContainer" key={task.id}>
              <div className="taskBg">
                <div className={task.isCompleted ? "done" : " "}>
                  <div className="taskNumber">{totalTasksDisplayed}</div>
                  <div className="taskText">{task.title}</div>
                </div>

                <div className="iconsWrap">
                  <span
                    title="Completed / Not Completed"
                    onClick={(e) => taskCompleted(task.id)}
                  >
                    <FontAwesomeIcon icon={faCircleCheck} />
                  </span>

                  {task.isCompleted ? null : (
                    <span title="Edit" onClick={() => handleEdit(task.id)}>
                      <FontAwesomeIcon icon={faPen} />
                    </span>
                  )}

                  <span onClick={() => deleteTask(task.id)} title="Delete">
                    <FontAwesomeIcon icon={faTrashCan} />
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* pagination jsx */}

        {tasks.length > 0 && (
          <div className="pagination">
            <div className="arrows" onClick={() => selectPageHandle(page - 1)}>
              <MdKeyboardArrowLeft size={25} />
            </div>
            <div className="pageNumbers">
              {[...Array(Math.ceil(tasks.length / 5))].map((n, i) => {
                return (
                  <div
                    className={`num ${page === i + 1 ? `numActive` : ""}`}
                    onClick={() => selectPageHandle(i + 1)}
                  >
                    {i + 1}
                  </div>
                );
              })}
            </div>
            <div className="arrows" onClick={() => selectPageHandle(page + 1)}>
              <MdKeyboardArrowRight size={25} />
            </div>
          </div>
        )}

        {!updatedTask && !updatedTask ? (
          <>
            {/* //  Add task  */}

            <div className="inputti">
              <div className="col">
                <input
                  value={task}
                  placeholder="Lisää tehtävä"
                  onChange={(e) => setTask(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="col-auto addButtonCont">
                <span title="Lisää" onClick={onSubmitTask}>
                  <FontAwesomeIcon className="addButton" icon={faAdd} />
                </span>
              </div>
            </div>
            <p className="taskError">{registrationError}</p>

            <br />
          </>
        ) : (
          <>
            <div className="inputti2">
              <div className="col">
                <input
                  value={updatedTask}
                  onChange={(e) => setupdatedTask(e.target.value)}
                  className="form-input2"
                />
              </div>
              <div className="col-auto">
                <button
                  onClick={handleUpdate}
                  className="btn btn-lg btn-success"
                >
                  Update task
                </button>
                <button
                  onClick={cancelUpdate}
                  className="btn btn-lg btn-warning"
                >
                  Cancel
                </button>
              </div>
            </div>
            <br />
          </>
        )}
      </div>
    </div>
  );
};
