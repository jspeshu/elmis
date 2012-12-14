package org.openlmis.rnr.domain;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.openlmis.core.domain.Facility;
import org.openlmis.upload.Importable;
import org.openlmis.upload.annotation.ImportField;

import java.util.Date;

@Data
@NoArgsConstructor
public class RequisitionGroupMember implements Importable {

    @ImportField(mandatory = true, name = "RG Code", nested = "code")
    private RequisitionGroup requisitionGroup;

    @ImportField(mandatory = true, name = "Member Facility", nested = "code")
    private Facility facility;

    private String modifiedBy;
    private Date modifiedDate;

}
