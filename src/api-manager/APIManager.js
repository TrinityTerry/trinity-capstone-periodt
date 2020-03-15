import * as firebase from "firebase/app";
import * as moment from "moment";

import "firebase/database";

// const database = firebase.database();

const APIManager = {
  createNewUser(userId, user_typeId) {
    firebase
      .database()
      .ref("users/" + userId)
      .update({
        first_name: false,
        last_name: false,
        username: false,
        is_active: true,
        notifications_enabled: false,
        created_at: false,
        isGuardian: false,
        colorId: "#000000",
        time_zone: moment.tz.guess(),
        user_typeId: user_typeId
      });
  },
  getUserInfo(userId) {
    return firebase
      .database()
      .ref("/users/" + userId)
      .once("value")
      .then(function(snapshot) {
        return snapshot.val() || "Anonymous";
      });
  },
  createCycleData(userId, cycle_start_date, period_start_date, cycle_end_date) {
    const newPostKey = firebase
      .database()
      .ref()
      .child("cycles")
      .push().key;
    firebase
      .database()
      .ref("cycles/" + newPostKey)
      .set({
        userId: userId,
        start_at: cycle_start_date,
        period_start_date: period_start_date,
        end_at: cycle_end_date
      });
  },
  createUserAverages(userId) {
    firebase
      .database()
      .ref("averages/" + userId)
      .set({
        cycle_days: 28,
        period_days: 5
      });
  },
  addMoodLog(cycleId, mood_typeId, time_created) {
    const newPostKey = firebase
      .database()
      .ref()
      .child("mood_logs")
      .push().key;
    firebase
      .database()
      .ref("mood_logs/" + newPostKey)
      .set({
        cycleId: cycleId,
        mood_typeId: mood_typeId,
        date_time: time_created
      });
  },
  addFlowLog(cycleId, flow_typeId, time_created) {
    const newPostKey = firebase
      .database()
      .ref()
      .child("flow_logs")
      .push().key;
    firebase
      .database()
      .ref("flow_logs/" + newPostKey)
      .set({
        cycleId: cycleId,
        flow_typeId: flow_typeId,
        date_time: time_created
      });
  },
  addNoteLog(content, time_created, cycleId) {
    const newPostKey = firebase
      .database()
      .ref()
      .child("note_logs")
      .push().key;
    firebase
      .database()
      .ref("note_logs/" + newPostKey)
      .set({
        content: content,
        created_at: time_created,
        cycleId: cycleId
      });
  },
  addToDataBase(reference, obj) {
    const newPostKey = firebase
      .database()
      .ref()
      .child(reference)
      .push().key;
    firebase
      .database()
      .ref(reference + newPostKey)
      .update(obj);
  },
  getData(reference, child, property) {
    return firebase
      .database()
      .ref(reference + "/")
      .once("value")
      .then(function(snapshot) {
        return snapshot.child(child + "/" + property).val(); //returns value of property
      });
  }
};

export default APIManager;
