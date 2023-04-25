import React from "react";
import { useState, useEffect } from "react";
import happy from "../assets/happy.jpg";
import { db, auth } from "../Config/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, getAuth } from "firebase/auth";

import {
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
  where,
} from "firebase/firestore";

export const Home = () => {
  const [user, setUser] = useState({});
  const [date, setDate] = useState(null);
  const [year, setYear] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(null);

  const [tasks, setTasks] = useState([]);
  const [updatedTask, setupdatedTask] = useState();
  const [editId, setEditId] = useState("");
  const [task, setTask] = useState("");

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

  console.log(user.email);

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
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        const querySnapshot = await getDocs(
          query(collection(db, "tasks"), where("userId", "==", userId))
        );
        const filteredData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        filteredData.sort((a, b) => a.createdAt - b.createdAt);
        setTasks(filteredData);
      }
    } catch (err) {
      console.error(err);
    }
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

  const onSubmitTask = async () => {
    try {
      await addDoc(tasksCollectionRef, {
        title: task,
        userId: auth?.currentUser?.uid,
        createdAt: new Date().getTime(),
      });
      setTask("");
      getTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="tasks-container">
      <div className="task-container">
        <div className="welcome-section">
          <h3 className="kaunofontti">MyDailyTasks</h3>
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
        {/* <div className="notasks-message">
          {tasks && tasks.length ? " " : "Sinulla ei ole yhtään  tehtävää."}
        </div> */}

        {tasks &&
          tasks.map((task, key) => {
            return (
              <div key={task.id}>
                <div className="taskBg">
                  <div className={task.isCompleted ? "done" : " "}>
                    <span className="taskNumber">{key + 1}</span>
                    <span className="taskText">{task.title}</span>
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
        <>
          <div className="tasks-count">
            {tasks.length < 1 ? (
              <>
                <img src={happy} className="happy" />
                <p>
                  <b>Sinulla ei ole yhtään tehtävää!</b>
                </p>
              </>
            ) : (
              <p>
                Sinulla on <b>{tasks.length}</b> tehtävää
              </p>
            )}
          </div>
        </>

        {!updatedTask && !updatedTask ? (
          <>
            {/* //  Add task  */}

            <div className="row justify-content-center">
              <div className="col-8">
                <input
                  value={task}
                  placeholder="Lisää tehtävä"
                  onChange={(e) => setTask(e.target.value)}
                  className="form-control form-control-lg"
                />
              </div>
              <div className="col-auto">
                <button
                  onClick={onSubmitTask}
                  className="btn btn-lg btn-success"
                >
                  Add
                </button>
              </div>
            </div>
            <br />
          </>
        ) : (
          <>
            <div className="row">
              <div className="col">
                <input
                  value={updatedTask}
                  onChange={(e) => setupdatedTask(e.target.value)}
                  className="form-control form-control-lg"
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
