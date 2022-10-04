//레미콘사 견적내역
function remicon_getApi_order(id) {
  num_remicon_order++;
  //Korean
  var lang_kor = {
    decimal: "",
    emptyTable: "데이터가 없습니다.",
    info: "_START_ 부터- _END_ 까지 (총 _TOTAL_ 데이터)",
    infoEmpty: "0개",
    infoFiltered: "(전체 _MAX_명 중 검색결과)",
    infoPostFix: "",
    thousands: ",",
    lengthMenu: "_MENU_개씩 보기",
    loadingRecords: "로딩중...",
    processing: "처리중...",
    search: "검색 :",
    zeroRecords: "검색된 데이터가 없습니다.",
    paginate: {
      first: "첫 페이지",
      last: "마지막페이지",
      next: "다음",
      previous: "이전",
    },
    aria: { sortAscending: ":오름차순 정렬", sortDescending: ":내림차순 정렬" },
  };

  var editor; // use a global for the submit and return data rendering in the examples

  $(document).ready(function () {
    // $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
    //   let min1 = Date.parse($("#order_fromDate").val());
    //   let max1 = Date.parse($("#order_toDate").val());
    //   let targetDate1 = Date.parse(data[1]);
    //   console.log("주문min", min1);
    //   console.log("주문max", max1);
    //   console.log("주문targetDate", targetDate1);
    //   if (
    //     (isNaN(min1) && isNaN(max1)) ||
    //     (isNaN(min1) && targetDate1 <= max1) ||
    //     (min1 <= targetDate1 && isNaN(max1)) ||
    //     (targetDate1 >= min1 && targetDate1 <= max1)
    //   ) {
    //     return true;
    //   }
    //   return false;
    // });

    //CRUD
    editor = new $.fn.dataTable.Editor({
      //`/api/remicon_esimate_management/${id}`,
      ajax: `/api/remicon_order_management/${id}`,
      // type: "post",
      table: "#remicon_order_table",
      fields: [
        {
          label: "주문아이디",
          name: "assignments.id",
        },
        {
          label: "건설사",
          name: "companies.name",
        },
        {
          label: "건설현장",
          name: "spaces.name",
        },

        {
          label: "배송일정 시작",
          name: "assignments.start_time",
          type: "datetime",
        },
        {
          label: "배송일정 끝",
          name: "assignments.end_time",
          type: "datetime",
        },
        {
          label: "배정일자",
          name: "assignments.date",
          type: "datetime",
        },
        {
          label: "특기사항",
          name: "assignments.remark",
        },
        {
          label: "합계수량",
          name: "assignments.total",
        },
        {
          label: "물차",
          name: "assignments.mulcha",
          type: "checkbox",
          options: [
            { label: "체크", value: "1" },
            { label: "미체크", value: "0" },
          ],
        },
        {
          label: "몰탈",
          name: "assignments.multal",
          type: "checkbox",
          options: [
            { label: "체크", value: "1" },
            { label: "미체크", value: "0" },
          ],
        },
        {
          label: "유도제",
          name: "assignments.inducer",
          type: "checkbox",
          options: [
            { label: "체크", value: "1" },
            { label: "미체크", value: "0" },
          ],
        },
        {
          label: "굵은골재",
          name: "assignment_specs.value",
        },
        {
          label: "호칭강도",
          name: "assignment_specs.norminal_strength",
        },
        {
          label: "슬럼프",
          name: "assignment_specs.slump",
          // options: [
          //   { label: "체크", value: "1" },
          //   { label: "미체크", value: "0" },
          // ],
        },
        {
          label: "수량",
          name: "assignment_specs.quantity",
        },
        // {
        //   label: "견적상태",
        //   name: "assignments.status",
        //   type: "select",
        //   options: [
        //     { label: "요청", value: "REQUESTED" },
        //     { label: "확인", value: "CONFIRMED" },
        //     { label: "삭제", value: "REMOVED" },
        //   ],
        // },
      ],
    });

    // 항목별 검색기능
    if (num_remicon_order === 1) {
      $("#remicon_order_table thead tr")
        .clone(true)
        .appendTo("#remicon_order_table thead")
        .addClass("remicon_filters_order");
    }

    var table = $("#remicon_order_table").DataTable({
      orderCellsTop: true,
      fixedHeader: true,
      // destroy: true,
      // searching: true,
      initComplete: function () {
        var api = this.api();

        // For each column
        api
          .columns()
          .eq(0)
          .each(function (colIdx) {
            // Set the header cell to contain the input element
            var cell = $(".remicon_filters_order th").eq(
              $(api.column(colIdx).header()).index()
            );
            var title = $(cell).text();
            $(cell).html('<input type="text" placeholder="검색" />');

            // On every keypress in this input
            $(
              "input",
              $(".remicon_filters_order th").eq(
                $(api.column(colIdx).header()).index()
              )
            )
              .off("keyup change")
              .on("change", function (e) {
                // Get the search value
                $(this).attr("title", $(this).val());
                var regexr = "({search})"; //$(this).parents('th').find('select').val();

                // Search the column for that value
                api
                  .column(colIdx)
                  .search(
                    this.value != "" ? this.value : "",
                    this.value != "",
                    this.value == ""
                  )
                  .draw();
              })
              .on("keyup", function (e) {
                e.stopPropagation();

                $(this).trigger("change");
              });
          });
      },
      // 항목별 검색기능 끝.
      //DATA 바인딩
      dom: "Bfrtip",
      ajax: {
        url: `/api/remicon_order_management/${id}`,
        type: "POST",
      },
      language: lang_kor,
      columns: [
        { data: "assignments.id" },
        { data: "assignments.date" },
        { data: "companies.id" },
        { data: "companies.name" },
        { data: "spaces.id" },
        { data: "spaces.name" },

        {
          data: null,
          render: function (data, type, row) {
            return (
              data.assignments.start_time + " ~ " + data.assignments.end_time
            );
          },
        },

        { data: "assignments.total" },
        { data: "assignments.remark" },
      ],
      select: true,
      // serverSide: true,
      searchable: true,
      search: {
        regex: true,
      },
      destroy: true,
      buttons: [
        { extend: "create", editor: editor, text: "등록" },
        { extend: "edit", editor: editor, text: "상세보기 및 수정" },
        { extend: "remove", editor: editor, text: "삭제" },
        {
          extend: "collection",
          text: "내보내기",
          buttons: ["excel", "csv"],
        },
      ],
    });

    let current_year = new Date().getFullYear();

    // $("#remicon_order_table_filter").prepend(
    //   '<input type="date" id="toDate" placeholder="yyyy-MM-dd" value=' +
    //     current_year +
    //     "-12-31>"
    // );
    // $("#remicon_order_table_filter").prepend(
    //   '<input type="date" id="fromDate" placeholder="yyyy-MM-dd" value=' +
    //     current_year +
    //     "-01-01>~"
    // );

    // $("#toDate, #fromDate")
    //   .unbind()
    //   .bind("keyup", function () {
    //     table.draw();
    //   });

    $("#remicon_order_table_filter").prepend(
      '<input type="date" id="order_toDate" placeholder="yyyy-MM-dd" value=' +
        current_year +
        "-12-31>"
    );
    $("#remicon_order_table_filter").prepend(
      '<input type="date" id="order_fromDate" placeholder="yyyy-MM-dd" value=' +
        current_year +
        "-01-01>~"
    );

    $("#order_toDate, #order_fromDate")
      .unbind()
      .bind("keyup", function () {
        table.draw();
      });
  });
}
