import { combineReducers } from "redux";
import theme from "./theme";
import snackbar from "./snackbar";
import pageTitle from "./currentPage";
import userInfo from "./userInfo";
import userClasses from "./userClasses";
import timetable from "./timetable";
import reminders from "./reminders";
import confirmDialog from "./confirmDialog";
import ajaxLoading from "./ajaxLoading";
import loadError from "./loadError";
import moreActions from "./moreActions";
import carouselView from "./carouselView";
import contextMenu from "./contextMenu";
import helpDialog from "./helpDialog";
import users from "./users";
import usersDialog from "./usersDialog";
import chats from "./chats";
import books from "./books";

export default combineReducers({
    theme, snackbar, pageTitle, userInfo, userClasses, timetable, reminders, confirmDialog, ajaxLoading, loadError, moreActions, carouselView, contextMenu, helpDialog, users, usersDialog, chats, books,
});