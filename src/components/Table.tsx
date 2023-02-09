import { useState } from "react";
import { IonCol, IonGrid, IonIcon, IonInput, IonItem, IonRow } from "@ionic/react";
import { qrCodeOutline } from "ionicons/icons";
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { mergeSearch } from "../constants";

export const Table: React.FC<any> = ({
  filters = "", children = () => { }, headings = [], data = [], searchKeys = [], onQRScan
}) => {
  const [search, setSearch] = useState('');
  return (
    <>
      <IonGrid>
        <IonRow>
          <IonCol sizeXl="8" sizeLg="6" sizeSm="12" sizeXs="12">
            {filters}
          </IonCol>
          <IonCol sizeXl="4" sizeLg="6" sizeSm="12" sizeXs="12">
            <IonItem>
              <IonInput
                onIonChange={(e: any) => setSearch(e.detail.value)}
                placeholder="Search"
                clearInput
              />
              {onQRScan && (
                <IonIcon icon={qrCodeOutline}
                  onClick={async () => {
                    const data = await BarcodeScanner.scan();
                    if (data.format === "QR_CODE") {
                      onQRScan(data.text)
                    }
                  }}
                />
              )}
            </IonItem>
          </IonCol>
        </IonRow>
        <table className="ionic-table">
          <thead>
            <tr>
              {headings.map((head: string) => <th key={head}>{head}</th>)}
            </tr>
          </thead>
          <tbody>
            {children(mergeSearch({ data, search, options: { keys: searchKeys } }))}
          </tbody>
        </table>
      </IonGrid >
    </>
  );
};
