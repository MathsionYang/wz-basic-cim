/**
 * 判断是否在楼层内
 * @param {*} gdid
 */
export const bJudge = gdid => {
  const fun = judgeFuns[`b${gdid}`] || judgeFuns["b14"];
  const point = [parseInt(Math.random() * 70), parseInt(Math.random() * 70)];
  return fun(point) ? point : false;
};

const judgeFuns = {
  default(point) {
    return true;
  },
  //    华盟商务(环)
  b1(point) {
    if (point[0] <= 6 || point[1] <= 2 || point[0] >= 62 || point[1] >= 64) {
      return false;
    }
    if (point[0] >= 16 && point[0] <= 50 && point[1] >= 14 && point[1] <= 52) {
    } else {
      return true;
    }
    return false;
  },
  //    大自然(多块)
  b2(point) {
    if (
      (point[0] >= 32 && point[0] <= 24 && point[1] >= 38 && point[1] <= 62) ||
      (point[0] >= 8 && point[0] <= 12 && point[1] >= 16 && point[1] <= 44)
    ) {
      return true;
    }
    return false;
  },
  //  中通大厦
  b3(point) {
    if (point[0] >= 6 && point[0] <= 28 && point[1] >= 2 && point[1] <= 64) {
      return true;
    }
    return false;
  },
  //    发展大厦(环)
  b4(point) {
    if (point[0] <= 8 || point[1] <= 8 || point[0] >= 36 || point[1] >= 56) {
      return false;
    }
    if (point[0] >= 14 && point[0] <= 28 && point[1] >= 18 && point[1] <= 46) {
    } else {
      return true;
    }
    return false;
  },
  //    世贸大厦(环)
  b5(point) {
    if (point[0] <= 7 || point[1] <= 7 || point[0] >= 62 || point[1] >= 60) {
      return false;
    }
    if (point[0] >= 18 && point[0] <= 55 && point[1] >= 16 && point[1] <= 56) {
    } else {
      return true;
    }
    return false;
  },
  //  温州国际贸易中心大楼
  b6(point) {
    if (point[0] >= 10 && point[0] <= 62 && point[1] >= 6 && point[1] <= 58) {
      return true;
    }
    return false;
  },
  //    大自然(多块)
  b7(point) {
    if (
      (point[0] >= 6 && point[0] <= 36 && point[1] >= 3 && point[1] <= 26) ||
      (point[0] >= 6 && point[0] <= 36 && point[1] >= 42 && point[1] <= 64)
    ) {
      return true;
    }
    return false;
  },
  //    海港大厦(环)
  b8(point) {
    if (point[0] <= 8 || point[1] <= 2 || point[0] >= 60 || point[1] >= 62) {
      return false;
    }
    if (point[0] >= 22 && point[0] <= 46 && point[1] >= 14 && point[1] <= 52) {
    } else {
      return true;
    }
    return false;
  },
  //  新城大厦
  b9(point) {
    if (point[0] >= 7 && point[0] <= 36 && point[1] >= 18 && point[1] <= 48) {
      return true;
    }
    return false;
  },
  //    置信大厦(环)
  b11(point) {
    if (point[0] <= 8 || point[1] <= 6 || point[0] >= 62 || point[1] >= 58) {
      return false;
    }
    if (point[0] >= 20 && point[0] <= 52 && point[1] >= 10 && point[1] <= 52) {
    } else {
      return true;
    }
    return false;
  },
  //    松台大厦
  b13(point) {
    if (point[0] >= 6 && point[0] <= 32 && point[1] >= 2 && point[1] <= 64) {
      return true;
    }
    return false;
  },
  //    default
  b14(point) {
    if (point[0] >= 6 && point[0] <= 44 && point[1] >= 6 && point[1] <= 60) {
      return true;
    }
    return false;
  },
  //    诚远大厦(多边型)
  b16(point) {
    if (
      (point[0] >= 7 && point[0] <= 46 && point[1] >= 1 && point[1] <= 34) ||
      (point[0] >= 7 && point[0] <= 20 && point[1] >= 36 && point[1] <= 60) ||
      (point[0] >= 20 &&
        point[0] <= 46 &&
        point[1] >= 36 &&
        point[1] <= 60 &&
        (point[0] - 20) / (60 - point[1]) <= 1)
    ) {
      return true;
    }
    return false;
  },
  //    展鑫大厦
  b17(point) {
    if (point[0] >= 4 && point[0] <= 20 && point[1] >= 2 && point[1] <= 62) {
      return true;
    }
    return false;
  },
  //    展银大厦
  b18(point) {
    if (point[0] >= 18 && point[0] <= 42 && point[1] >= 6 && point[1] <= 32) {
      return true;
    }
    return false;
  },
  //    机械大厦(环)
  b19(point) {
    if (point[0] <= 4 || point[1] <= 1 || point[0] >= 40 || point[1] >= 62) {
      return false;
    }
    if (point[0] >= 14 && point[0] <= 30 && point[1] >= 10 && point[1] <= 54) {
    } else {
      return true;
    }
    return false;
  },
  //    国信大厦(多块)
  b20(point) {
    if (
      (point[0] >= 4 && point[0] <= 24 && point[1] >= 9 && point[1] <= 36) ||
      (point[0] >= 7 && point[0] <= 12 && point[1] >= 36 && point[1] <= 58)
    ) {
      return true;
    }
    return false;
  },
  //    鹿港大厦(多块)
  b21(point) {
    if (
      (point[0] >= 4 && point[0] <= 30 && point[1] >= 6 && point[1] <= 30) ||
      (point[0] >= 12 && point[0] <= 30 && point[1] >= 42 && point[1] <= 60)
    ) {
      return true;
    }
    return false;
  },
  //    深蓝国际(多块)
  b22(point) {
    if (
      (point[0] >= 18 && point[0] <= 66 && point[1] >= 2 && point[1] <= 16) ||
      (point[0] >= 6 && point[0] <= 62 && point[1] >= 44 && point[1] <= 62)
    ) {
      return true;
    }
    return false;
  },
  //    同人恒玖(环)
  b23(point) {
    if (point[0] <= 6 || point[1] <= 14 || point[0] >= 38 || point[1] >= 64) {
      return false;
    }
    if (point[0] >= 14 && point[0] <= 28 && point[1] >= 22 && point[1] <= 56) {
    } else {
      return true;
    }
    return false;
  },
  //    宏国大厦(多块)
  b24(point) {
    if (
      (point[0] >= 28 && point[0] <= 34 && point[1] >= 4 && point[1] <= 46) ||
      (point[0] >= 6 && point[0] <= 16 && point[1] >= 20 && point[1] <= 60)
    ) {
      return true;
    }
    return false;
  },
  //    财富
  b25(point) {
    if (point[0] >= 12 && point[0] <= 28 && point[1] >= 2 && point[1] <= 50) {
      return true;
    }
    return false;
  },
  //    交行广场
  b32(point) {
    if (point[0] >= 14 && point[0] <= 36 && point[1] >= 20 && point[1] <= 62) {
      return true;
    }
    return false;
  },
  //    万康商务中心
  b38(point) {
    if (point[0] >= 5 && point[0] <= 15 && point[1] >= 12 && point[1] <= 60) {
      return true;
    }
    return false;
  },
  //    中保大厦
  b52(point) {
    if (point[0] >= 10 && point[0] <= 56 && point[1] >= 14 && point[1] <= 54) {
      return true;
    }
    return false;
  },
  //    滨润大厦
  b57(point) {
    if (point[0] >= 4 && point[0] <= 24 && point[1] >= 4 && point[1] <= 65) {
      return true;
    }
    return false;
  }
};
