import PropTypes from "prop-types"
import { IonButton } from "@ionic/react";
import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export const Excel = ({ fileName, dataSet, dataLayout }) => {
  return (
    <ExcelFile
      filename={fileName}
      style={{ width: "100%" }}
      element={<IonButton style={{ width: "100%" }}>Download Excel</IonButton>}
    >
      <ExcelSheet data={dataSet} name={fileName}>
        {dataLayout.map(({ label, value }) => (
          <ExcelColumn key={label + value} label={label} value={value} />
        ))}
      </ExcelSheet>
    </ExcelFile>
  );
}
Excel.propTypes = {
  fileName: PropTypes.string,
  dataSet: PropTypes.instanceOf(Array),
  dataLayout: PropTypes.instanceOf(Array)
}
Excel.defaultProps = {
  fileName: "Download",
  dataSet: [],
  dataLayout: []
}
