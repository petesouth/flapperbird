export const isEmpty = (obj) => {
  for (var key in obj) {
    if (obj.hasOwnProperty(key))
      return false;
  }
  return true;
}

export const getStatus = (status) => {

  if (!status) return 'err';
  let statMap = new Map();
  statMap.set(1, "Open");
  statMap.set(2, "Refer Out");
  statMap.set(100, "Closed");

  return statMap.get(status);
}

export const getProvincesbyCountryId = (id, provinces) => {
  console.log('getProvincesbyCountryId', id, provinces)
  if (!id) {
    return provinces;
  }

  if (!provinces) {
    console.log('missing provinces in getProvincesbyCountryId')
    return '';
  }

  let p = []
  for (let province in provinces) {
    if (provinces[province].country_id === id) {

      p.push(provinces[province]);
    }
  }
  console.log('getProvincesbyCountryId returning', p)
  return p;
}

export const getCrossingProvinces = (id, provinces) => {
  console.log('Utils getCrossingProvinces', id)
  if (!id) {
    return provinces;
  }

  if (!provinces) {
    console.log('missing provinces in getCrossingProvinces')
    return '';
  }

  let p = []
  for (let province in provinces) {
    //console.log('province', province, 'country_id', provinces[province].country_id, 'crossing', provinces[province].crossing)
    if (provinces[province].country_id === id && provinces[province].crossing === 1) {
      p.push(provinces[province]);
    }
  }
  //console.log('getCrossingProvinces returning', p)
  return p;
}

export const getDistrictsByCountryId = (id, districts) => {
  //console.log('getDistrictsByCountryId got', id, districts)

  if (!id) {
    return districts;
  }

  if (!districts) {
    console.log('missing districts in getDistrictsByCountryId')
    return '';
  }

  let d = []
  for (let district in districts) {
    if (districts[district].country_id === id) {
      d.push(districts[district]);
    }
  }
  console.log('getDistrictsByCountryId returning', d)
  return d;
}

export const getDistrictsByProvinceId = (id, districts) => {
  console.log('getDistrictsByProvinceId', id, districts)
  if (!id) {
    return districts;
  }

  if (!districts) {
    console.log('missing districts in getDistrictsByProvinceId')
    return '';
  }

  let d = []
  for (let district in districts) {
    if (districts[district].province_id === id) {
      d.push(districts[district]);
    }
  }
  console.log('getDistrictsByProvinceId returning', d)
  return d;
}


export const getLocaleNameById = (id, items) => {
  //console.log('getLocaleNameById, ', id, items);
  if (!id || !items[id]) {
    console.log('getLocaleNameById failed, ', id, 'not found');
    return '';
  }
  return items[id].name
}

export const getUsersShortList = (usersList) => {
  if (!usersList) {
    return [];
  }

  return Object.assign([], usersList)
    .filter(item => { return item.active === 1 })
    .sort((a, b) => {
      let itemA = a.firstname.toUpperCase();
      let itemB = b.firstname.toUpperCase();
      if (itemA < itemB) {
        return -1;
      }
      if (itemA > itemB) {
        return 1;
      }

      return 0;
    })
    .map(item => {
      let user = { id: 'user-' + item.id, label: item.firstname + " " + item.surname, value: item.id };

      if (item.nickname) {
        user.label += " (" + item.nickname + ")";
      }
      return user;
    })
}

export const getUserShortName = (id, users) => {

  try {
    console.log('getUserShortName', id, users);
    if (!id || !users || !users[id]) {
      return '';
    }

    if (users[id].nickname) {
      console.log('returning', users[id].nickname);
      return users[id].nickname;
    }
    console.log('returning', users[id].firstname);
    return users[id].firstname;

  } catch (err) {
    console.error("Error: getUserShortName", err);
    return "" + id;
  }

}

export const getCookieValue = (a) => {
  var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
  return b ? b.pop() : '';
}

export const setCookie = (attr, val, expiry) => {
  if (expiry) {
    var d = new Date();
    d.setTime(d.getTime() + (expiry * 24 * 60 * 60 * 1000));
    var expiry = "expires=" + d.toUTCString();
    document.cookie = attr + "=" + val + "; " + expiry;
  } else {
    document.cookie = attr + "=" + val + "; ";
  }
}

export const deleteCookie = (name) => {
  if (!name) { return }
  document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

export const deNullify = (obj) => {
  if (!obj) return;

  let newObj = {};
  Object.keys(obj).forEach((prop) => {
    if (obj[prop]) { newObj[prop] = obj[prop]; }
  });
  return newObj;
};

export const formatDate = (d) => {
  ///console.log('formatDate', d)
  const date_options = { year: 'numeric', month: 'short', day: 'numeric' };
  let formatDate = new Date(d).toLocaleDateString('default', date_options)
  return formatDate;
}