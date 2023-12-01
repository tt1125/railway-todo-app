import React from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import { Home } from "../pages/Home";
import { NotFound } from "../pages/NotFound";
import { SignIn } from "../pages/SignIn";
import { NewTask } from "../pages/NewTask";
import { NewList } from "../pages/NewList";
import { EditTask } from "../pages/EditTask";
import { SignUp } from "../pages/SignUp";
import { EditList } from "../pages/EditList";
import { Test } from "../pages/Test";

export const Router = () => {
  const auth = useSelector((state) => state.auth.isSignIn);

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/test" Component={Test} />
        <Route exact path="/signin" Component={SignIn} />
        <Route exact path="/signup" Component={SignUp} />
        {auth ? (
          <>
            <Route exact path="/" Component={Home} />
            <Route exact path="/task/new" Component={NewTask} />
            <Route exact path="/list/new" Component={NewList} />
            <Route
              exact
              path="/lists/:listId/tasks/:taskId"
              Component={EditTask}
            />
            <Route exact path="/lists/:listId/edit" Component={EditList} />
          </>
        ) : (
          <Navigate to="/signin" />
        )}
        <Route Component={NotFound} />
      </Routes>
    </BrowserRouter>
  );
};
