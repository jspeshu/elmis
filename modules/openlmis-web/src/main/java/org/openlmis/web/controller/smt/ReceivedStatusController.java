/*
 * This program was produced for the U.S. Agency for International Development. It was prepared by the USAID | DELIVER PROJECT, Task Order 4. It is part of a project which utilizes code originally licensed under the terms of the Mozilla Public License (MPL) v2 and therefore is licensed under MPL v2 or later.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the Mozilla Public License as published by the Mozilla Foundation, either version 2 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the Mozilla Public License for more details.
 *
 * You should have received a copy of the Mozilla Public License along with this program. If not, see http://www.mozilla.org/MPL/
 */

package org.openlmis.web.controller.smt;

import org.openlmis.core.exception.DataException;
import org.openlmis.vaccine.domain.Status;
import org.openlmis.vaccine.service.smt.StatusService;
import org.openlmis.web.controller.BaseController;
import org.openlmis.web.response.OpenLmisResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletRequest;

import static org.openlmis.web.response.OpenLmisResponse.success;
import static org.springframework.web.bind.annotation.RequestMethod.DELETE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

@Controller
@RequestMapping(value="/vaccine/received-status/")
@Deprecated
public class ReceivedStatusController extends BaseController {

    @Autowired
    private StatusService statusService;

    @RequestMapping(value = "/save", method = POST, headers = ACCEPT_JSON)
    //  @PreAuthorize("@permissionEvaluator.hasPermission(principal,'MANAGE_VACCINE')")
    public ResponseEntity insert(@RequestBody Status status, HttpServletRequest request) {

        status.setCreatedBy(loggedInUserId(request));
        status.setModifiedBy(loggedInUserId(request));

        ResponseEntity<OpenLmisResponse> response;

        try {
            statusService.saveStatus(status);

        } catch(DataException exp){
            return OpenLmisResponse.error(exp.toString(), HttpStatus.BAD_REQUEST);
        }

        response = success("Received Status added Successfully");
        return response;
    }

    @RequestMapping(value = "/delete/{id}", method = DELETE, headers = ACCEPT_JSON)
    //  @PreAuthorize("@permissionEvaluator.hasPermission(principal,'MANAGE_VACCINE')")
    public ResponseEntity delete(@PathVariable(value="id") Long id){

        ResponseEntity<OpenLmisResponse> response;

        try{

            statusService.deleteStatus(id);

        } catch(DataException exp){
            return OpenLmisResponse.error(exp.toString(), HttpStatus.BAD_REQUEST);
        }

        response = success("Received status deleted Successfully");
        return response;
    }

    @RequestMapping(value = "/list", method = GET, headers = ACCEPT_JSON)
    public ResponseEntity getAll() {
        return OpenLmisResponse.response("receivedStatus", statusService.getStatusList());
    }

    @RequestMapping(value = "/get/{id}", method = GET, headers = ACCEPT_JSON)
    public ResponseEntity get(@PathVariable(value="id") Long id) {
        return OpenLmisResponse.response("receivedStatus", statusService.getStatus(id));
    }

    @RequestMapping(value = "/search", method = GET)
    public ResponseEntity searchUser(@RequestParam(required = true) String param) {
        return OpenLmisResponse.response("receivedStatus", statusService.search(param));
    }
}
