// 건설사견적내역
function remicon_getApi_Transaction(id) {
  num_remicon_transaction++;
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
    aria: {
      sortAscending: ":오름차순 정렬",
      sortDescending: ":내림차순 정렬",
    },
  };

  var editor; // use a global for the submit and return data rendering in the examples

  if (id === null) {
    retrun;
  }
  $(document).ready(function () {
    // $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
    //   let min = Date.parse($("#transaction_fromDate").val());
    //   let max = Date.parse($("#transaction_toDate").val());
    //   let targetDate = Date.parse(data[0]);
    //   console.log("min", min);
    //   console.log("max", max);
    //   console.log("targetDate", targetDate);
    //   if (
    //     (isNaN(min) && isNaN(max)) ||
    //     (isNaN(min) && targetDate <= max) ||
    //     (min <= targetDate && isNaN(max)) ||
    //     (targetDate >= min && targetDate <= max)
    //   ) {
    //     return true;
    //   }
    //   return false;
    // });
    //CRUD

    editor = new $.fn.dataTable.Editor({
      ajax: `/api/remicon_Transaction_history/${id}`,
      table: "#remicon_transaction_table",
      fields: [
        {
          label: "납품일자",
          name: "assignments.date",
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
          label: "건설현장주소",
          name: "spaces.basic_address",
        },
        {
          label: "상태",
          name: "assignments.status",
          type: "select",
          options: [
            { label: "요청", value: "REQUESTED" },
            { label: "확인", value: "CONFIRMED" },
            { label: "삭제", value: "REMOVED" },
          ],
        },
      ],
    });

    // 항목별 검색기능
    if (num_remicon_transaction === 1) {
      $("#remicon_transaction_table thead tr")
        .clone(true)
        .appendTo("#remicon_transaction_table thead")
        .addClass("remicon_filters_transactions");
    }

    var table = $("#remicon_transaction_table").DataTable({
      orderCellsTop: true,
      fixedHeader: true,
      destroy: true,
      searching: true,
      initComplete: function () {
        var api = this.api();

        // For each column
        api
          .columns()
          .eq(0)
          .each(function (colIdx) {
            // Set the header cell to contain the input element
            var cell = $(".remicon_filters_transactions th").eq(
              $(api.column(colIdx).header()).index()
            );
            var title = $(cell).text();
            $(cell).html('<input type="text" placeholder="검색" />');

            // On every keypress in this input
            $(
              "input",
              $(".remicon_filters_transactions th").eq(
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
                    this.value != ""
                      ? regexr.replace("{search}", "(((" + this.value + ")))")
                      : "",
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
      // 항목별 검색기능 끝. keyid		url:`/api/remicon_transaction_table/:${id}`,
      //DATA 바인딩
      dom: "Bfrtip",
      ajax: {
        url: `/api/remicon_Transaction_history/${id}`,
        type: "POST",
      },
      language: lang_kor,
      columns: [
        // { data: "assignments.id"},
        { data: "assignments.date" },
        { data: "companies.id" },
        { data: "companies.name" },
        { data: "spaces.id" },
        { data: "spaces.name" },
        { data: "standard" },
        // {
        //   data: "assignments.status",
        //   render: function (data, type, row) {
        //     switch (data) {
        //       case "REQUESTED":
        //         return "요청";
        //         break;
        //       case "CONFIRMED":
        //         return "확인";
        //         break;
        //       case "REMOVED":
        //         return "삭제";
        //         break;
        //       case null:
        //         return "";
        //         break;
        //     }
        //   },
        // },
      ],
      // serverSide: true,
      select: true,
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
    var current_year = new Date().getFullYear();

    // $("#remicon_transaction_table_filter").prepend(
    //   '<input type="date" id="transaction_toDate" placeholder="yyyy-MM-dd" value=' +
    //     current_year +
    //     "-12-31>"
    // );
    // $("#remicon_transaction_table_filter").prepend(
    //   '<input type="date" id="transaction_fromDate" placeholder="yyyy-MM-dd" value=' +
    //     current_year +
    //     "-01-01>~"
    // );

    // $("#transaction_toDate, #transaction_fromDate")
    //   .unbind()
    //   .bind("keyup", function () {
    //     table.draw();
    //   });
  });
}
