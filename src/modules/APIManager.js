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
          defaultPeriod: 5,
        },
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
    )
      .then((resp) => resp.json())
      .catch((error) => console.log(error));
  },
  getData(reference, child, property) {
    return firebase
      .database()
      .ref(reference + "/")
      .once("value")
      .then(function (snapshot) {
        return snapshot.child(child + "/" + property).val();
      })
      .catch((error) => console.log(error));
  },
  findUserName(username) {
    return fetch(
      `https://periodt-1584121712792.firebaseio.com/users.json?orderBy="username"&equalTo="${username}"`
    )
      .then((resp) => resp.json())
      .catch((error) => console.log(error));
  },
  getUserCycles(uid) {
    return fetch(
      `https://periodt-1584121712792.firebaseio.com/cycles/${uid}.json`
    ).then((resp) => resp.json());
  },
  updateCycle(uid, cycleId, obj) {
    return firebase
      .database()
      .ref("cycles/" + uid + "/" + cycleId)
      .update(obj)
      .catch((error) => console.log(error));
  },
  getResource(query) {
    return fetch(`https://periodt-1584121712792.firebaseio.com/${query}.json`)
      .then((resp) => resp.json())
      .catch((error) => console.log(error));
  },
  getCustomQuery(query) {
    return fetch(`https://periodt-1584121712792.firebaseio.com/${query}`)
      .then((resp) => resp.json())
      .catch((error) => console.log(error));
  },
  getLogByDate(uid, category, date) {
    return fetch(
      `https://periodt-1584121712792.firebaseio.com/${category}_logs/${uid}.json?orderBy="date"&equalTo="${date}"`
    )
      .then((resp) => resp.json())
      .catch((error) => console.log(error));
  },
  getDrafts(uid, query) {
    return fetch(
      `https://periodt-1584121712792.firebaseio.com/${query}/${uid}.json?orderBy="isDraft"&equalTo=true`
    )
      .then((resp) => resp.json())
      .catch((error) => console.log(error));
  },
  deleteLog(logtype, uid, logId) {
    const ref = firebase.database().ref(logtype + "/" + uid + "/" + logId);
    return firebase
      .database()
      .ref(logtype + "/" + uid + "/" + logId)
      .once("value")
      .then((snapshot) => {
        return snapshot.val();
      })
      .then((deleting) => {
        return ref
          .remove()
          .then(() => {
            return firebase
              .database()
              .ref(logtype + "/" + uid)
              .once("value")
              .then((snapshot) => {
                return {
                  current: snapshot.val(),
                  deleting: deleting
                };
              });
          })
          .catch((error) => console.log(error));
      });
  },
  updateLog(ref, obj) {
    return firebase
      .database()
      .ref(ref)
      .update(obj)
      .then(() => {
        return firebase
          .database()
          .ref(ref)
          .once("value")
          .then((snapshot) => {
            return snapshot.val();
          });
      })
      .catch((error) => {
        console.log(error);
      });
  },
  checkCycleDay(query, uid, orderBy, equalTo) {
    return fetch(
      `https://periodt-1584121712792.firebaseio.com/${query}/${uid}.json?orderBy="${orderBy}"&equalTo="${equalTo}"`
    )
      .then((resp) => resp.json())
      .catch((error) => console.log(error));
  },
};

{
  /*
 setSnackbarObj((prevState) => {
      newObj = { ...prevState };
      return newObj;
    }); 
    */
  // {
  //   isOpen: false,
  //   handleClose: () => {
  //     setSnackbarObj((prevState) => {
  //       const newObj = { ...prevState };
  //       newObj.isOpen = false;
  //       return newObj;
  //     });
  //   },
  //   content: "Add Content",
  //   severity: "success",
  //   transition: "fade",
  //   snackClass: "pt-sitewide-snackbar",
  //   vertical: "top",
  //   horizontal: "center",
  // }
}
export default APIManager;
