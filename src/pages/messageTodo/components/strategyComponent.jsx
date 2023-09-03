import { Radio, Row, Col, Layout } from 'antd';
import styles from '../setPanel.less';
const { Content } = Layout;

/**
 * 设置页面的导航
 */
export const SetPanelLayout = ({ currentTitle, rightNode = <></>, children }) => {
  return (
    <>
      <Row className={styles.generalTitle} type="flex" justify="space-between">
        <Col>
          <div className={styles.verticalLine} />
          <span className={styles.title}>{currentTitle}</span>
        </Col>
        <Col>{rightNode}</Col>
      </Row>
      <Content className={styles.generalContent}>{children}</Content>
    </>
  );
};
/**
 * 选择颜色的组建
 */
export const CheckColorItem = props => {
  const {
    data: { name, color, code, subCode },
    submitData,
    firstActivety,
  } = props;

  const handlerChange = e => {
    e.persist();
    // console.log(e.target.value);
    // console.log(data);
    const target = submitData[firstActivety].find(item => {
      if (item.subCode) {
        return (code || subCode) === item.subCode;
      } else {
        return (code || subCode) === item.firstCode;
      }
    });
    target.color = e.target.value;
  };
  return (
    <div className={styles.pickColorItem}>
      <span>{name}</span>
      <input
        type="color"
        defaultValue={color || undefined}
        className="pickColor"
        onChange={handlerChange}
      />
    </div>
  );
};

/**
 * 事项设置的模版的容器
 */
export const TemplateWrap = props => {
  const { allSysList, currentValue, onChangeCallback } = props;
  console.log(currentValue);
  return (
    <div>
      <Radio.Group value={currentValue} onChange={onChangeCallback}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          {allSysList.map((item, index) => {
            return <TemplateItem data={item} key={index} />;
          })}
        </div>
      </Radio.Group>
    </div>
  );
};
/**
 * 事项设置的模版item
 */
const TemplateItem = props => {
  const {
    data: { name, list },
  } = props;
  return (
    <div style={{ marginRight: '10px' }}>
      <div>
        <div>
          <div style={{ backgroundColor: list[0]?.color, height: '30px', width: '150px' }} />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '1px',
            }}
          >
            {list.map((item, index) => {
              return (
                <div
                  style={{ backgroundColor: list[index]?.color, height: '30px', width: '29px' }}
                  key={index}
                />
              );
            })}
          </div>
        </div>
        <Radio
          value={name}
          style={{ display: 'block', margin: '5px auto 20px', textAlign: 'center' }}
        >
          {name}
        </Radio>
      </div>
    </div>
  );
};
