const watermarkOption = {};

const setWatermarkContent = content => {
  const id = '1.23452384164.123412415';

  if (document.getElementById(id) !== null) {
    document.body.removeChild(document.getElementById(id));
  }

  const ele = document.createElement('canvas');
  ele.width = 450;
  ele.height = 200;

  const getCanvas = ele.getContext('2d');
  getCanvas.rotate((-10 * Math.PI) / 180);
  getCanvas.font = '20px Vedana';
  getCanvas.fillStyle = 'rgba(200, 200, 200, 0.20)';
  getCanvas.textAlign = 'center';
  getCanvas.textBaseline = 'Middle';
  getCanvas.fillText(content, ele.width / 3, ele.height / 2);

  const div = document.createElement('div');
  div.id = id;
  div.style.pointerEvents = 'none';
  div.style.top = '0px'; // 水印距离 上边的距离
  div.style.left = '0px'; // 水印距离 左边的距离
  div.style.position = 'fixed';
  div.style.zIndex = '100000';
  div.style.width = document.documentElement.clientWidth + 'px'; // 生成水印画布大小的宽度
  div.style.height = document.documentElement.clientHeight + 'px'; // 生成水印画布大小的高度
  div.style.background = 'url(' + ele.toDataURL('image/png') + ') left top repeat';
  document.body.appendChild(div);
  return id;
};

// 该方法只允许调用一次
watermarkOption.set = content => {
  let id = setWatermarkContent(content);
  setInterval(() => {
    if (document.getElementById(id) === null) {
      id = setWatermarkContent(content);
    }
  }, 500);
  window.onresize = () => {
    setWatermarkContent(content);
  };
};

export default watermarkOption;
