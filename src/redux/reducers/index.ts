import { combineReducers } from "redux";
import pageTitle from "./currentPage";
import userInfo from "./userInfo";
import userClasses from "./userClasses";
import timetable from "./timetable";
import reminders from "./reminders";
import loadError from "./loadError";
import carouselView from "./carouselView";
import contextMenu from "./contextMenu";
import helpDialog from "./helpDialog";
import users from "./users";
import usersDialog from "./usersDialog";
import chats from "./chats";
import books from "./books";
import moreActions from "./moreActions";
export default combineReducers({
    pageTitle, userInfo, userClasses, timetable, reminders, loadError, carouselView, contextMenu, helpDialog, users, usersDialog, chats, books, moreActions,
});