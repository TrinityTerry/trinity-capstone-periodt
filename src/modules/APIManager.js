import * as firebase from "firebase/app";
import * as moment from "moment";
import "moment-timezone";
import "firebase/database";

const APIManager = {
  createNewUser(userId) {
    return firebase
      .database()
      .ref("users/" + userId)
      .update({
        first_name: false,
        last_name: false,
        nickname: false,
        is_active: true,
        notifications_enabled: false,
        created_at: moment().format(),
        isGuardian: false,
        colorId: "#000000",
        time_zone: moment.tz.guess(),
        user_typeId: "-M2MIfctqbGwdELnL-6d",
        uid: userId,
        averageCycleDays: 0,
        averagePeriodDays: 0,
        minCycle: 10,
        maxCycle: 60,
        settings: {
          notifications_enabled: false,
          useDefaultCycle: true,
          ignoreMin: 10,
          ignoreMax: 60,
          defaultCycle: 28,
          defaultPeriod: 5
        }
      });
  },
  updateUser(obj, userId) {
    return firebase
      .database()
      .ref("users/" + userId)
      .update(obj);
  },
  getUserInfo(userId) {
    return fetch(
      `https://periodt-1584121712792.firebaseio.com/users.json?orderBy="uid"&equalTo="${userId}"`
    ).then(resp => resp.json());
  },
  getData(reference, child, property) {
    return firebase
      .database()
      .ref(reference + "/")
      .once("value")
      .then(function(snapshot) {
        return snapshot.child(child + "/" + property).val();
      });
  },
  findUserName(username) {
    return fetch(
      `https://periodt-1584121712792.firebaseio.com/users.json?orderBy="username"&equalTo="${username}"`
    ).then(resp => resp.json());
  },
  getUserCycles(uid) {
    return fetch(
      `https://periodt-1584121712792.firebaseio.com/cycles/${uid}.json`
    ).then(resp => resp.json());
  },
  updateCycle(uid, cycleId, obj) {
    return firebase
      .database()
      .ref("cycles/" + uid + "/" + cycleId)
      .update(obj);
  },
  getResource(query) {
    return fetch(
      `https://periodt-1584121712792.firebaseio.com/${query}.json`
    ).then(resp => resp.json());
  },
  getLogByDate(uid, category, date) {
    return fetch(
      `https://periodt-1584121712792.firebaseio.com/${category}_logs/${uid}.json?orderBy="date"&equalTo="${date}"`
    ).then(resp => resp.json());
  },
  getDrafts(uid, query) {
    return fetch(
      `https://periodt-1584121712792.firebaseio.com/${query}/${uid}.json?orderBy="isDraft"&equalTo=true`
    ).then(resp => resp.json());
  },
  deleteLog(logtype, uid, logId) {
    return firebase
      .database()
      .ref(logtype + "/" + uid + "/" + logId)
      .remove();
  },
  updateLog(ref, obj) {
    firebase
      .database()
      .ref(ref)
      .update(obj);
  },
  checkCycleDay(query, uid, orderBy, equalTo) {
    return fetch(
      `https://periodt-1584121712792.firebaseio.com/${query}/${uid}.json?orderBy="${orderBy}"&equalTo="${equalTo}"`
    ).then(resp => resp.json());
  }
};

export default APIManager;
