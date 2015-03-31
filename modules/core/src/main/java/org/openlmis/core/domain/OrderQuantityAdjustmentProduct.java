package org.openlmis.core.domain;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import groovy.transform.EqualsAndHashCode;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

import static com.fasterxml.jackson.databind.annotation.JsonSerialize.Inclusion.NON_EMPTY;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonSerialize(include = NON_EMPTY)
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(callSuper = true)
public class OrderQuantityAdjustmentProduct extends BaseModel {

    private Facility facility;
    private Product product;
    private OrderQuantityAdjustmentType adjustmentType;
    private OrderQuantityAdjustmentFactor adjustmentFactor;
    private Date startDate;
    private Date endDate;
    private Long minMOS;
    private Long maxMOS;
    private String formula;


}
