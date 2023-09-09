let allUsers = [];
const addUser = document.querySelector("#addUser");
const editUser = document.querySelector("#edit-user");
const showAll = document.querySelector("#showAll");
const formHeaders = ["id", "userName", "email", "age", "status"];
const dataWrap = document.querySelector("#dataWrap");
const single = document.querySelector("#single");

const handleStatusBtn = function (class1, class2, state, msg, user) {
  this.textContent = msg;
  this.classList.remove(class1);
  this.classList.add(class2);
  user.status = state;
};

const createUserObj = function (formData) {
  const user = {};
  formHeaders.forEach((h) => {
    if (h === "id") user[h] = Date.now();
    else if (h === "status") user[h] = 0;
    else user[h] = formData[h].value;
  });
  return user;
};

const storeToLocalStorage = function (key, data) {
  let myData;
  try {
    myData = JSON.stringify(data);
  } catch (e) {
    myData = "[]";
  }
  localStorage.setItem(key, myData);
};

if (addUser) {
  addUser.addEventListener("submit", function (e) {
    e.preventDefault();
    const allUsers = JSON.parse(localStorage.getItem("myUsers")) || [];
    let user = createUserObj(addUser.elements);
    allUsers.push(user);
    storeToLocalStorage("myUsers", allUsers);
    addUser.reset();
    window.location = "index.html";
  });
}

const createMyOwnEle = function (parent, ele, txt, classes) {
  let myEle = document.createElement(ele);
  if (txt) myEle.textContent = txt;
  if (classes) myEle.classList = classes;
  parent.appendChild(myEle);
  return myEle;
};

const drawall = function (usersData) {
  dataWrap.textContent = "";
  if (!usersData.length) {
    const tr = document.createElement("tr");
    dataWrap.appendChild(tr);
    tr.textContent = "no users yet";
  }
  usersData.forEach((user, index) => {
    const tr = createMyOwnEle(dataWrap, "tr", null, null);
    formHeaders.forEach((head) => {
      if (head !== "status") createMyOwnEle(tr, "td", user[head], null);
    });
    const td = createMyOwnEle(tr, "td", null, null);

    const delBtn = createMyOwnEle(
      td,
      "button",
      "delete",
      "btn btn-danger mx-2"
    );
    const editBtn = createMyOwnEle(
      td,
      "button",
      "edit",
      "btn btn-primary mx-2"
    );

    const showBtn = createMyOwnEle(
      td,
      "button",
      "show",
      "btn btn-warning mx-2"
    );

    const statusBtn = createMyOwnEle(
      td,
      "button",
      usersData[index].status ? "deactivate" : "activate",
      `btn btn-${usersData[index].status ? "success" : "secondary"} mx-2`
    );

    delBtn.addEventListener("click", function (e) {
      usersData.splice(index, 1);
      tr.remove();
      storeToLocalStorage("myUsers", usersData);
      drawall(usersData);
    });

    showBtn.addEventListener("click", function (e) {
      localStorage.setItem("single", JSON.stringify(user));
      window.location = "single.html";
    });

    editBtn.addEventListener("click", function () {
      let choice;
      do {
        choice = prompt(`Enter the number of choice you want to edit
      1 : Name
      2 : Email
      3 : Age
      0 : Exit`);
        switch (choice) {
          case "1":
            usersData[index].userName =
              prompt("new user name , please : ") || usersData[index].userName;
            break;
          case "2":
            usersData[index].email =
              prompt("new email, please : ") || usersData[index].email;
            break;
          case "3":
            usersData[index].age = prompt("new age, please : ");
            break;
          default:
            break;
        }
      } while (choice !== "0");

      storeToLocalStorage("myUsers", usersData);
    });

    statusBtn.addEventListener("click", function () {
      this.classList.contains("btn-secondary")
        ? handleStatusBtn.call(
            this,
            "btn-secondary",
            "btn-success",
            1,
            "deactivate",
            usersData[index]
          )
        : handleStatusBtn.call(
            this,
            "btn-success",
            "btn-secondary",
            0,
            "activate",
            usersData[index]
          );
      storeToLocalStorage("myUsers", usersData);
    });
  });
};

if (dataWrap) {
  const usersData = JSON.parse(localStorage.getItem("myUsers")) || [];
  drawall(usersData);
}

if (single) {
  const userData = JSON.parse(localStorage.getItem("single"));
  single.textContent = `${userData.id} - ${userData.userName}`;
}
