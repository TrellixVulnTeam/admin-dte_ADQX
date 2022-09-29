function construction_fieldlist_table_list(id) {
  num_field_list++;

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
    //CRUD

    editor = new $.fn.dataTable.Editor({
      ajax: `/api/construction_fieldlist_table/${id}`,
      table: "#construction_fieldlist_table",
      fields: [
        {
          label: "소속현장리스트",
          name: "spaces.name",
        },
        {
          label: "현장별주소",
          name: "spaces.basic_address",
        },
        {
          label: "현장별 권한(구매담당자)",
          name: "spaces.admin_user_id",
        },
        {
          label: "현장별 권한(주문담당자)",
          name: "spaces.site_user_id",
        },
      ],
    });
    // 항목별 검색기능
    if (num_field_list == 1) {
      $("#construction_fieldlist_table thead tr")
        .clone(true)
        .appendTo("#construction_fieldlist_table thead")
        .addClass("con_fieldlist_filters");
    }
    $("#construction_fieldlist_table").DataTable({
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
            var cell = $(".con_fieldlist_filters th").eq(
              $(api.column(colIdx).header()).index()
            );
            var title = $(cell).text();
            $(cell).html('<input type="text" placeholder="검색" />');

            // On every keypress in this input
            $(
              "input",
              $(".con_fieldlist_filters th").eq(
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
      // 항목별 검색기능 끝. keyid		url:`/api/construction_fieldlist_table/:${id}`,
      //DATA 바인딩
      dom: "Bfrtip",
      ajax: {
        url: `/api/construction_fieldlist_table/${id}`,
        type: "POST",
      },
      language: lang_kor,
      columns: [
        { data: "spaces.name" },
        { data: "spaces.basic_address" },
        { data: "users.name" },
        { data: "users.name" },
      ],
      serverSide: true,
      select: true,
      destroy: true,
      buttons: [],
    });
  });
}
