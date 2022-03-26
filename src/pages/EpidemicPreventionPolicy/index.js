import { citysData } from "./citysData";
import { Cascader, Descriptions, Image } from "antd";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
const EpidemicPreventionPolicy = () => {
  const [options, setOptions] = useState([
    {
      value: "zhejiang",
      label: "Zhejiang",
      children: [
        {
          value: "hangzhou",
          label: "Hangzhou",
          children: [
            {
              value: "xihu",
              label: "West Lake",
            },
          ],
        },
      ],
    },
  ]);
  const [startingPoint, setStartingPoint] = useState("");
  const [endingPoint, setEndingPoint] = useState("");
  const [fromInfo, setFromInfo] = useState("");
  const [toInfo, setToInfo] = useState("");
  // 是否显示
  const [isDisplay, setIsDisplay] = useState(false);
  const column = 1;

  // let options = [
  // {
  //   value: "zhejiang",
  //   label: "Zhejiang",
  //   children: [
  //     {
  //       value: "hangzhou",
  //       label: "Hangzhou",
  //       children: [
  //         {
  //           value: "xihu",
  //           label: "West Lake",
  //         },
  //       ],
  //     },
  //   ],
  // },
  //   {
  //     value: "jiangsu",
  //     label: "Jiangsu",
  //     children: [
  //       {
  //         value: "nanjing",
  //         label: "Nanjing",
  //         children: [
  //           {
  //             value: "zhonghuamen",
  //             label: "Zhong Hua Men",
  //           },
  //         ],
  //       },
  //     ],
  //   },
  // ];
  useEffect(() => {
    console.log(citysData);
    let newCitysDataList = [];
    citysData.map((provinceItem, provinceIndex) => {
      if (provinceItem.citys.length === 1) {
        provinceItem.citys.map((item, index) => {
          newCitysDataList.push({ value: item.city_id, label: item.city });
        });
      } else {
        newCitysDataList.push({
          value: provinceItem.province_id,
          label: provinceItem.province,
          children: [],
        });
        provinceItem.citys.map((item, index) => {
          newCitysDataList[provinceIndex].children.push({
            value: item.city_id,
            label: item.city,
          });
        });
      }
    });
    setOptions(newCitysDataList);

    // setOptions([
    //   {
    //     value: "zhejiang",
    //     label: "Zhejiang",
    //     children: [
    //       {
    //         value: "hangzhou",
    //         label: "Hangzhou",
    //         children: [
    //           {
    //             value: "xihu",
    //             label: "West Lake",
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // ]);
  }, []);

  //起点
  const onChangeStartingPoint = (value) => {
    if (value) {
      if (value.length === 1) {
        setStartingPoint(value[0]);
      } else {
        setStartingPoint(value[1]);
      }
    }
    console.log(value);
  };

  // 终点
  const onChangeEndingPoint = (value) => {
    if (value) {
      if (value.length === 1) {
        setEndingPoint(value[0]);
      } else {
        setEndingPoint(value[1]);
      }
    }
    console.log(value);
  };

  // 返回最后一个选择的内容
  const displayRender = (label) => {
    return label[label.length - 1];
  };

  const filter = (inputValue, path) => {
    console.log(inputValue, path);
    return path.some(
      (option) =>
        option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
    );
  };

  // 查询一个地区到另一个地区的防疫政策
  const search = () => {
    console.log(startingPoint, endingPoint);
    axios
      .get(
        `/api?from=${parseInt(startingPoint)}&to=${parseInt(
          endingPoint
        )}&key=d7d34becccdde98118252af8a2b3ccd5`
      )
      .then((res) => {
        console.log(res);
        setFromInfo({ ...res.data.result.from_info });
        setToInfo({ ...res.data.result.to_info });
        setIsDisplay(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <button
        onClick={() => {
          console.log(options);
        }}
      >
        点击测试
      </button>
      <div>
        <span>从</span>
        <Cascader
          allowClear
          showSearch={{ filter }}
          options={options}
          // expandTrigger鼠标经过以后会自动展示下一级
          expandTrigger="hover"
          displayRender={displayRender}
          onChange={onChangeStartingPoint}
        />
        <span>到</span>
        <Cascader
          allowClear
          showSearch={{ filter }}
          options={options}
          // expandTrigger鼠标经过以后会自动展示下一级
          expandTrigger="hover"
          displayRender={displayRender}
          onChange={onChangeEndingPoint}
          // 这个search是有用的。假如需要调后台接口去查找数据的时候应该就会用到了，相当于比过滤高级点
          onSearch={(value) => {
            console.log(value);
          }}
        />
        <button onClick={search}>查询</button>
      </div>
      {isDisplay && (
        <Descriptions title={fromInfo.city_name} column={column}>
          <Descriptions.Item label="健康码">
            <span>{fromInfo.health_code_name}</span>
            <div>
              <Image width={200} src={fromInfo.health_code_picture} />
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="政策要求">
            {fromInfo.low_in_desc}
          </Descriptions.Item>
          <Descriptions.Item label="建议">
            {fromInfo.out_desc}
          </Descriptions.Item>
          <Descriptions.Item label="省份">
            {fromInfo.province_name}
          </Descriptions.Item>
        </Descriptions>
      )}
      {isDisplay && (
        <Descriptions title={toInfo.city_name} column={column}>
          <Descriptions.Item label="健康码">
            <span>{toInfo.health_code_name}</span>
            <div>
              <Image width={200} src={toInfo.health_code_picture} />
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="政策要求">
            {toInfo.low_in_desc}
          </Descriptions.Item>
          <Descriptions.Item label="建议">{toInfo.out_desc}</Descriptions.Item>
          <Descriptions.Item label="省份">
            {toInfo.province_name}
          </Descriptions.Item>
        </Descriptions>
      )}
    </div>
  );
};

export default EpidemicPreventionPolicy;
