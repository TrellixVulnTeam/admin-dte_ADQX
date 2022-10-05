// 건설사견적내역
function getApi_construction_transaction(id) {
  num_con_transaction++;

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

  // window.location.reload();
  var editor; // use a global for the submit and return data rendering in the examples
  let min;
  let max;
  min = $("#con_transaction_fromDate").val();
  max = $("#con_transaction_toDate").val();
  console.log("min max", min, max);

  if (id === null) {
    retrun;
  }
  $(document).ready(function () {
    //CRUD

    editor = new $.fn.dataTable.Editor({
      ajax: `/api/construction_Transaction_history/${id}/${min}/${max}`,
      table: "#construction_transaction_table",
      fields: [
        {
          label: "납품일자",
          name: "assignments.date",
          type: "datetime",
        },
        {
          label: "레미콘사코드",
          name: "companies.id",
        },
        {
          label: "레미콘사",
          name: "companies.name",
        },
        {
          label: "규격",
          name: "standard",
        },
        // {
        //   label: "상태",
        //   name: "assignments.status",
        //   type: "select",
        //   options: [
        //     { label: "요청", value: "REQUESTED" },
        //     { label: "확인", value: "CONFIRMED" },
        //     { label: "삭제", value: "REMOVE" },
        //   ],
        // },
      ],
    });

    // 항목별 검색기능
    if (num_con_transaction == 1) {
      $("#construction_transaction_table thead tr")
        .clone(true)
        .appendTo("#construction_transaction_table thead")
        .addClass("con_filters_transaction");
    }
    $("#construction_transaction_table").DataTable({
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
            var cell = $(".con_filters_transaction th").eq(
              $(api.column(colIdx).header()).index()
            );
            var title = $(cell).text();
            $(cell).html('<input type="text" placeholder="검색" />');

            // On every keypress in this input
            $(
              "input",
              $(".con_filters_transaction th").eq(
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
                $(this).focus()[0];
              });
          });
      },
      // 항목별 검색기능 끝. keyid		url:`/api/construction_transaction_table/:${id}`,
      //DATA 바인딩
      dom: "Bfrtip",
      ajax: {
        url: `/api/construction_Transaction_history/${id}/${min}/${max}`,
        // type: "get",
      },
      language: lang_kor,
      select: true,
      serverside: true,
      destroy: true,
      columns: [
        // { data: "assignments.id"},
        { data: "assignments.date" },
        { data: "companies.id" },
        { data: "companies.name" },
        { data: "standard" },
      ],

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

    $("#construction_transaction_table_filter").prepend(
      '<input type="date" id="con_transaction_toDate" placeholder="yyyy-MM-dd" value=' +
        current_year +
        "-12-31>"
    );
    $("#construction_transaction_table_filter").prepend(
      '<input type="date" id="con_transaction_fromDate" placeholder="yyyy-MM-dd" value=' +
        current_year +
        "-01-01>~"
    );

    $("#construction_transaction_table_filter").prepend(
      '<button type="button" id="con_transaction_button" placeholder="yyyy-MM-dd">조회</button>'
    );

    $("#con_transaction_button").click(function () {
      console.log("버튼클릭");

      min = $("#con_transaction_fromDate").val();
      max = $("#con_transaction_toDate").val();
      console.log("max", max);
      console.log("min", min);
      getApi_construction_transaction(id);
      // $.ajax({
      //   type: "POST",
      //   url: `/api/remicon_esimate_management/${id}/${min}/${max}`,
      //   success: function (data) {
      //     remicon_getApi(id);
      //   },
      // });
    });
  });
}
