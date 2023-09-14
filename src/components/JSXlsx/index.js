import React, { PureComponent } from "react";

/**
 * @Author xuning--徐宁
 * @Description excel 数据解析
 * @Date 18:56 2018/8/8
 * @Param
 *       type：'CSV' ,'JSON', 'FORMULAE' ,'HTML'  返回格式类型, 注释：无参或参数错误，默认为JSON格式
 *       ----***下列参数目前只作用于JSON数据返回***----
 *       sheet：[object]  获取目标sheet页数据
 *       startStop:[start,stop] 数据读取起止行数，作用域为所有sheet页!,当object中start、stop未设置默认参数时将生效
 *       object={
  *       name:String, --sheet页名称，必须
  *       start:Int,   --起始页码 ，非必须
  *       stop:Int     --终止页码 ，非必须
  *       }
 *       function :getData(String data) 回调方法
 * @return  String
 **/
class JSXlsx extends PureComponent {
  state = {
    wb :null
  };

  componentDidMount() {
    this.setState({
      wb:null
    })
  }
  /**
   * @Author xuning--徐宁
   * @Description excel文件加载,数据初始化
   * @Date 18:56 2018/8/8
   * @Param
   * @return
   **/
  importJSXlsx=()=>{
    let {type}=this.props;
    let object= this.refs._excelfile;
    let wb;          //读取完成的数据
    let rABS = true; //是否将文件读取为二进制字符串
    if(!object.files)  return;
    let f = object.files[0];
    let reader = new FileReader();

    if(rABS) reader.readAsBinaryString(f); else reader.readAsArrayBuffer(f);
    reader.onload =(e)=> {  //数据加载完成
      let data = e.target.result;
      if(!rABS) data = new Uint8Array(data);
      wb = XLSX.read(data, {type: rABS ? 'binary' : 'array'});
      if (type=="JSON"||type==null)   this._TOJSON(wb);
      if (type=="CSV")                this._TOCSV(wb);
      if (type=="FORMULAE")           this._TOFORMULAE(wb);
      if (type=="HTML")               this._TOHTML(wb);
      this.setState({
        wb:wb
      })
    };
  }


  /**
   * @Author xuning--徐宁
   * @Description json格式化
   * @Date 10:52 2018/8/9
   * @Param  wb
   * @return
   **/
  _TOJSON=(wb)=>{
    let {type,sheet,startStop,getData}=this.props;

    let result = {};
    for (let i=0; i < wb.SheetNames.length;i++){
      let sheetName=wb.SheetNames[i];
      let start=null,stop=null;
      let roa = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], {header:1,defval:""});
      if (sheet){
        let exist=false;
        sheet.map((obj) => {
          if (obj.name == sheetName) {
            exist = true;
            start = obj.start;
            stop = stop;
          }
        });
        if (exist) {
          if(start){
            if(stop) roa=roa.slice(start,stop);
            else roa=roa.slice(start);
          }
          if(start==null&& stop==null&& startStop) {
            start =startStop[0];
            stop  =startStop[1];
            if (stop==null) roa=roa.slice(start);
            else roa=roa.slice(start,stop);
          }
          if(roa.length) result['sheet'+(++i)] = roa;
          result.title = sheetName;
        }
      }else {
        if(start==null&& stop==null&& startStop) {
          start =startStop[0];
          stop  =startStop[1];
          if (stop==null) roa=roa.slice(start);
          else roa=roa.slice(start,stop);
        }
        if(roa.length) result['sheet'+(++i)] = roa;
        result.title = sheetName;
      }
    };

    let  _ToJSON=JSON.stringify(result);

    if (this.props.getData) this.props.getData(_ToJSON);
  };


  /**
   * @Author xuning--徐宁
   * @Description CSV格式
   * @Date 10:53 2018/8/9
   * @Param
   * @return
   **/
  _TOCSV=(wb)=>{
    let result = [];
    wb.SheetNames.forEach(function(sheetName) {
      var csv = XLSX.utils.sheet_to_csv(wb.Sheets[sheetName]);
      if(csv.length){
        result.push("SHEET: " + sheetName);
        result.push("");
        result.push(csv);
      }
    });
    if (this.props.getData) this.props.getData(result);
  }

  /**
   * @Author xuning--徐宁
   * @Description FORMULAE格式
   * @Date 10:53 2018/8/9
   * @Param
   * @return
   **/
  _TOFORMULAE=(wb)=>{
    let result = [];
    wb.SheetNames.forEach(function(sheetName) {
      let formulae = XLSX.utils.get_formulae(wb.Sheets[sheetName]);
      if(formulae.length){
        result.push("SHEET: " + sheetName);
        result.push("");
        // result.push(formulae.join("\n"));
      }
    });
    if (this.props.getData) this.props.getData(result);
  }

  /**
   * @Author xuning--徐宁
   * @Description html格式
   * @Date 10:53 2018/8/9
   * @Param
   * @return
   **/
  _TOHTML=(wb)=>{
    let htmlstr;
    wb.SheetNames.forEach(function(sheetName) {
      htmlstr = XLSX.write(wb, {sheet:sheetName, type:'string', bookType:'html'});

    });
    if (this.props.getData) this.props.getData(htmlstr);
  };


  render() {
    const { JSXlsxToJSON, renderStyle } = this.props;
    return (
      <div>
        <input type="file"
               ref="_excelfile"
               style={{ display: "none" }}
               id='JSXlsxInput'
               onChange={()=>this.importJSXlsx()}
        />
        {renderStyle ? renderStyle : null}
      </div>
    );
  }
}
export default JSXlsx;
