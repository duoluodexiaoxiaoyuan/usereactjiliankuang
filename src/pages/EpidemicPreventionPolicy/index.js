import { citysData } from "./citysData";
import { Cascader } from "antd";
import { useEffect } from "react";
import { useState } from "react";
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
    return path.some(
      (option) =>
        option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
    );
  };

  // 查询一个地区到另一个地区的防疫政策
  const search = () => {
    console.log(startingPoint, endingPoint);
  };

  return (
    <div>
      <div>你好</div>
      <button
        onClick={() => {
          console.log(options);
        }}
      >
        测试
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
        />
        <button onClick={search}>查询</button>
      </div>
    </div>
  );
};

export default EpidemicPreventionPolicy;
